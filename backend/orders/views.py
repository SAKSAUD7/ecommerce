from rest_framework import views, permissions, status, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from decimal import Decimal

from products.models import ProductVariant
from .models import Cart, CartItem, Order, OrderItem, Coupon, Payment, ReturnRequest
from .serializers import CartSerializer, OrderSerializer, CheckoutSerializer, CouponSerializer, ReturnRequestSerializer

class CartView(views.APIView):
    # Support authenticated users. For guest carts, session keys are used.
    permission_classes = [permissions.AllowAny]

    def get_cart(self, request):
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
                session_key = request.session.session_key
            cart, created = Cart.objects.get_or_create(session_key=session_key)
        return cart

    def get(self, request):
        cart = self.get_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        cart = self.get_cart(request)
        variant_id = request.data.get('variant_id')
        quantity = int(request.data.get('quantity', 1))

        if not variant_id:
            return Response({"detail": "variant_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        variant = get_object_or_404(ProductVariant, id=variant_id)
        
        if quantity <= 0:
            # Delete item if quantity is zero or less
            CartItem.objects.filter(cart=cart, variant=variant).delete()
            return Response(CartSerializer(cart).data)

        # Check stock limits
        if variant.stock < quantity:
            return Response({"detail": f"Insufficient stock. Only {variant.stock} left."}, status=status.HTTP_400_BAD_REQUEST)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, variant=variant)
        cart_item.quantity = quantity
        cart_item.save()

        return Response(CartSerializer(cart).data)

    def delete(self, request):
        cart = self.get_cart(request)
        variant_id = request.data.get('variant_id')
        
        if not variant_id:
            # Clear entire cart
            cart.items.all().delete()
            return Response(CartSerializer(cart).data)

        variant = get_object_or_404(ProductVariant, id=variant_id)
        CartItem.objects.filter(cart=cart, variant=variant).delete()
        return Response(CartSerializer(cart).data)

class CouponValidateView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({"detail": "Coupon code is required."}, status=status.HTTP_400_BAD_REQUEST)

        coupon = Coupon.objects.filter(code__iexact=code, active=True).first()
        if not coupon:
            return Response({"detail": "Invalid or inactive coupon code."}, status=status.HTTP_400_BAD_REQUEST)

        now_time = timezone.now()
        if coupon.valid_from > now_time or coupon.valid_to < now_time:
            return Response({"detail": "Coupon has expired or is not yet active."}, status=status.HTTP_400_BAD_REQUEST)

        if coupon.used_count >= coupon.max_uses:
            return Response({"detail": "Coupon usage limit reached."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(CouponSerializer(coupon).data)

class CheckoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Use items from payload if provided, otherwise fallback to DB cart
        payload_items = data.get('items', [])
        cart_items_data = []

        if payload_items:
            for item in payload_items:
                variant = get_object_or_404(ProductVariant, id=item['variant_id'])
                cart_items_data.append({
                    'variant': variant,
                    'quantity': item['quantity']
                })
        else:
            cart = getattr(request.user, 'cart', None)
            if not cart or not cart.items.exists():
                return Response({"detail": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)
            
            for item in cart.items.all():
                cart_items_data.append({
                    'variant': item.variant,
                    'quantity': item.quantity
                })

        # 1. Stock Check
        for item in cart_items_data:
            if item['variant'].stock < item['quantity']:
                return Response({"detail": f"Product {item['variant'].product.name} ({item['variant'].name}) is out of stock."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Price Calculations
        subtotal = sum(item['variant'].price * item['quantity'] for item in cart_items_data)
        
        # Shipping calculation (free over $1000, otherwise $50)
        shipping_cost = Decimal('0.00') if subtotal >= Decimal('1000.00') else Decimal('50.00')
        
        # Coupon discount
        discount = Decimal('0.00')
        coupon_obj = None
        coupon_code = data.get('coupon_code')
        if coupon_code:
            coupon = Coupon.objects.filter(code__iexact=coupon_code, active=True).first()
            if coupon and coupon.valid_from <= timezone.now() <= coupon.valid_to and coupon.used_count < coupon.max_uses:
                coupon_obj = coupon
                if coupon.discount_type == 'percentage':
                    discount = (subtotal * coupon.value / Decimal('100.00')).quantize(Decimal('0.01'))
                else:
                    discount = min(coupon.value, subtotal)
                
                # Increment coupon usage
                coupon.used_count += 1
                coupon.save()

        # Tax (8% standard luxury tax)
        tax = ((subtotal - discount) * Decimal('0.08')).quantize(Decimal('0.01'))
        total = subtotal - discount + tax + shipping_cost

        # 3. Create Order
        order = Order.objects.create(
            user=request.user,
            full_name=data['full_name'],
            email=data['email'],
            phone=data['phone'],
            shipping_address_line=data['street_address'],
            shipping_city=data['city'],
            shipping_state=data['state'],
            shipping_postal_code=data['postal_code'],
            shipping_country=data['country'],
            coupon=coupon_obj,
            subtotal=subtotal,
            tax=tax,
            shipping_cost=shipping_cost,
            discount=discount,
            total=total,
            status='paid' if data['payment_method'] != 'cod' else 'pending'
        )

        # 4. Create Order Items & Decrement Inventory
        for item in cart_items_data:
            OrderItem.objects.create(
                order=order,
                variant=item['variant'],
                price=item['variant'].price,
                quantity=item['quantity']
            )
            item['variant'].stock -= item['quantity']
            item['variant'].save()

        # 5. Process Payment Details
        payment_status = 'completed' if data['payment_method'] != 'cod' else 'pending'
        tx_id = data.get('payment_token') or f"mock_tx_{timezone.now().timestamp()}"
        Payment.objects.create(
            order=order,
            gateway=data['payment_method'],
            transaction_id=tx_id,
            amount=total,
            status=payment_status,
            response_payload=f"Successfully processed via {data['payment_method']}."
        )

        # 5.5 Trigger Dropshipping Supplier Routing
        try:
            from suppliers.services import route_order_to_suppliers
            route_order_to_suppliers(order.id)
        except Exception as e:
            print(f"Routing failed for order {order.id}: {e}")

        # 6. Clear DB Cart if used
        if not payload_items:
            cart = getattr(request.user, 'cart', None)
            if cart:
                cart.items.all().delete()

        # 7. Add reward loyalty points (1 point per $10 spent)
        points_earned = int(total // 10)
        request.user.rewards_points += points_earned
        request.user.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

class AdminOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Order.objects.all().order_by('-created_at')

class OrderTrackingView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        order_id = request.data.get('order_id')
        email = request.data.get('email')

        if not order_id or not email:
            return Response({"detail": "Order ID and email are required."}, status=status.HTTP_400_BAD_REQUEST)

        # In our system order ID can be the actual DB ID plus a base (e.g. #1005 -> 5)
        # Try to parse the ID. It might contain a '#' or be offset by 1000.
        try:
            if isinstance(order_id, str) and order_id.startswith('#'):
                order_id = order_id.replace('#', '')
            
            numeric_id = int(order_id)
            if numeric_id > 1000:
                numeric_id -= 1000
                
            order = Order.objects.get(id=numeric_id, email__iexact=email.strip())
            
            # Serialize necessary safe data for public tracking
            data = {
                "id": 1000 + order.id,
                "status": order.status,
                "created_at": order.created_at,
                "total": order.total,
                "shipping_address": f"{order.shipping_city}, {order.shipping_country}",
                "items_count": order.items.count(),
            }
            return Response(data, status=status.HTTP_200_OK)
        except (ValueError, Order.DoesNotExist):
            return Response({"detail": "Order not found with provided ID and email."}, status=status.HTTP_404_NOT_FOUND)

class AdminCouponViewSet(viewsets.ModelViewSet):
    """
    Admin-only endpoint to manage discount codes/coupons.
    """
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Coupon.objects.all().order_by('-valid_to')

class ReturnRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ReturnRequestSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return ReturnRequest.objects.all().order_by('-created_at')
        if self.request.user and self.request.user.is_authenticated:
            return ReturnRequest.objects.filter(user=self.request.user).order_by('-created_at')
        return ReturnRequest.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status in ['approved', 'refunded'] and instance.restock_inventory:
            for item in instance.order.items.all():
                item.variant.stock += item.quantity
                item.variant.save()

