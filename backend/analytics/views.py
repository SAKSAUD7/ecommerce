from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta

from orders.models import Order
from products.models import ProductVariant, Product

class AdminDashboardMetricsView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        # 1. Base KPIs
        from orders.models import SupplierOrder
        total_sales = Order.objects.filter(status='paid').aggregate(total=Sum('total'))['total'] or 0.00
        
        # Dropshipping analytics
        total_supplier_costs = SupplierOrder.objects.aggregate(cost=Sum('supplier_cost'))['cost'] or 0.00
        total_shipping_costs = SupplierOrder.objects.aggregate(shipping=Sum('shipping_cost'))['shipping'] or 0.00
        
        # Approximate Payment Gateway Fees (Stripe standard: 2.9% + 0.30 per transaction)
        paid_orders_count = Order.objects.filter(status='paid').count()
        gateway_fees = (float(total_sales) * 0.029) + (paid_orders_count * 0.30)
        
        gross_profit = float(total_sales) - float(total_supplier_costs) - float(total_shipping_costs)
        net_profit = gross_profit - gateway_fees
        
        total_orders = Order.objects.count()
        avg_order_value = Order.objects.filter(status='paid').aggregate(avg=Avg('total'))['avg'] or 0.00
        
        # 2. Inventory Alert calculations
        total_products = Product.objects.count()
        total_variants = ProductVariant.objects.count()
        out_of_stock_count = ProductVariant.objects.filter(stock=0).count()
        low_stock_count = ProductVariant.objects.filter(stock__gt=0, stock__lt=5).count()

        # 3. Recent 5 Orders
        recent_orders = Order.objects.order_by('-created_at')[:5]
        recent_orders_data = [{
            "id": o.id,
            "full_name": o.full_name,
            "total": float(o.total),
            "status": o.status,
            "created_at": o.created_at.strftime('%Y-%m-%d %H:%M')
        } for o in recent_orders]

        # 4. Sales Over Time (Last 7 Days)
        sales_over_time = []
        today = timezone.now().date()
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_sales = Order.objects.filter(
                status='paid', 
                created_at__date=day
            ).aggregate(total=Sum('total'))['total'] or 0.00
            
            sales_over_time.append({
                "date": day.strftime('%b %d'),
                "sales": float(day_sales)
            })

        # 5. Low stock item list
        low_stock_variants = ProductVariant.objects.filter(stock__lt=5).select_related('product')[:5]
        low_stock_items = [{
            "sku": v.sku,
            "name": f"{v.product.name} ({v.name})",
            "stock": v.stock
        } for v in low_stock_variants]

        # 6. Top Products by Units Sold
        from django.db.models import F
        from orders.models import OrderItem
        
        top_items = OrderItem.objects.filter(order__status='paid') \
            .values('variant__product__name') \
            .annotate(sales=Sum('quantity'), revenue=Sum(F('quantity') * F('price'))) \
            .order_by('-sales')[:5]
            
        top_products = []
        for item in top_items:
            top_products.append({
                "name": item['variant__product__name'],
                "sales": item['sales'],
                "revenue": float(item['revenue']) if item['revenue'] else 0
            })

        return Response({
            "metrics": {
                "totalSales": float(total_sales),
                "totalOrders": total_orders,
                "averageOrderValue": float(avg_order_value),
                "totalProducts": total_products,
                "outOfStockCount": out_of_stock_count,
                "lowStockCount": low_stock_count,
                "grossProfit": gross_profit,
                "netProfit": net_profit,
                "gatewayFees": gateway_fees,
                "supplierCosts": float(total_supplier_costs)
            },
            "recentOrders": recent_orders_data,
            "salesOverTime": sales_over_time,
            "lowStockItems": low_stock_items,
            "topProducts": top_products
        })
