from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem, Coupon, Payment
from products.models import ProductVariant
from products.serializers import ProductVariantSerializer, ProductSerializer

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ('id', 'code', 'discount_type', 'value', 'active')

class CartItemSerializer(serializers.ModelSerializer):
    variant_details = ProductVariantSerializer(source='variant', read_only=True)
    product_details = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ('id', 'variant', 'variant_details', 'product_details', 'quantity')

    def get_product_details(self, obj):
        return ProductSerializer(obj.variant.product).data

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('id', 'items', 'subtotal')

    def get_subtotal(self, obj):
        return sum(item.variant.price * item.quantity for item in obj.items.all())

class OrderItemSerializer(serializers.ModelSerializer):
    variant_details = ProductVariantSerializer(source='variant', read_only=True)
    product_name = serializers.CharField(source='variant.product.name', read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ('id', 'variant', 'variant_details', 'product_name', 'product_image', 'price', 'quantity')
        
    def get_product_image(self, obj):
        image = obj.variant.product.images.first()
        if image:
            return image.image_url
        return None

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_status = serializers.CharField(source='payment.status', read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'items', 'full_name', 'email', 'phone',
            'shipping_address_line', 'shipping_city', 'shipping_state',
            'shipping_postal_code', 'shipping_country', 'coupon',
            'subtotal', 'tax', 'shipping_cost', 'discount', 'total',
            'status', 'tracking_number', 'shipping_provider', 'payment_status', 'created_at'
        )

class CheckoutItemSerializer(serializers.Serializer):
    variant_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class CheckoutSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    street_address = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100)
    coupon_code = serializers.CharField(max_length=50, required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=(('stripe', 'Stripe'), ('razorpay', 'Razorpay'), ('cod', 'COD')))
    payment_token = serializers.CharField(max_length=150, required=False, allow_blank=True)
    items = CheckoutItemSerializer(many=True, required=False)
