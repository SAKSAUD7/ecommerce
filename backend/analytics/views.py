from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count, Avg, F, ExpressionWrapper, DecimalField
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from orders.models import Order, OrderItem, ReturnRequest, Payment, SupplierOrder
from products.models import ProductVariant, Product, Category, Brand

class AdminDashboardMetricsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        total_sales = Order.objects.filter(status='paid').aggregate(total=Sum('total'))['total'] or Decimal('0.00')
        total_supplier_costs = SupplierOrder.objects.aggregate(cost=Sum('supplier_cost'))['cost'] or Decimal('0.00')
        total_shipping_costs = SupplierOrder.objects.aggregate(shipping=Sum('shipping_cost'))['shipping'] or Decimal('0.00')
        
        paid_orders_count = Order.objects.filter(status='paid').count()
        gateway_fees = (float(total_sales) * 0.029) + (paid_orders_count * 0.30)
        
        gross_profit = float(total_sales) - float(total_supplier_costs) - float(total_shipping_costs)
        net_profit = gross_profit - gateway_fees
        
        total_orders = Order.objects.count()
        avg_order_value = Order.objects.filter(status='paid').aggregate(avg=Avg('total'))['avg'] or Decimal('0.00')
        
        total_products = Product.objects.count()
        total_variants = ProductVariant.objects.count()
        out_of_stock_count = ProductVariant.objects.filter(stock=0).count()
        low_stock_count = ProductVariant.objects.filter(stock__gt=0, stock__lt=5).count()

        recent_orders = Order.objects.order_by('-created_at')[:5]
        recent_orders_data = [{
            "id": o.id,
            "full_name": o.full_name,
            "total": float(o.total),
            "status": o.status,
            "created_at": o.created_at.strftime('%Y-%m-%d %H:%M')
        } for o in recent_orders]

        sales_over_time = []
        today = timezone.now().date()
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_sales = Order.objects.filter(
                status='paid', 
                created_at__date=day
            ).aggregate(total=Sum('total'))['total'] or Decimal('0.00')
            
            sales_over_time.append({
                "date": day.strftime('%b %d'),
                "sales": float(day_sales)
            })

        low_stock_variants = ProductVariant.objects.filter(stock__lt=5).select_related('product')[:5]
        low_stock_items = [{
            "sku": v.sku,
            "name": f"{v.product.name} ({v.name})",
            "stock": v.stock
        } for v in low_stock_variants]

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


class AdminReportsAnalyticsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # 1. Total Sales by Billing Location (Calculated dynamically from real DB orders)
        location_data = Order.objects.filter(status='paid') \
            .values('shipping_country') \
            .annotate(
                orders_count=Count('id'),
                total_sales=Sum('total'),
                shipping_charges=Sum('shipping_cost'),
                taxes=Sum('tax'),
                discounts=Sum('discount')
            ) \
            .order_by('-total_sales')

        location_rows = []
        donut_slices = []
        palette = ["#0091FF", "#6E25F4", "#4B5563", "#D946EF", "#06B6D4", "#EC4899", "#8B5CF6", "#F59E0B", "#10B981"]

        total_global_sales = sum(loc['total_sales'] or 0 for loc in location_data)

        for idx, loc in enumerate(location_data):
            cname = loc['shipping_country'] or "International"
            tsales = float(loc['total_sales'] or 0)
            tship = float(loc['shipping_charges'] or 0)
            ttax = float(loc['taxes'] or 0)
            tdisc = float(loc['discounts'] or 0)
            net = tsales - tship - ttax

            color = palette[idx % len(palette)]
            donut_slices.append({
                "name": cname,
                "value": round(tsales, 2),
                "displayVal": f"${tsales:,.2f}",
                "color": color
            })

            location_rows.append({
                "country": cname,
                "orders": loc['orders_count'],
                "reversals": f"-${tdisc:,.2f}",
                "netSales": f"${net:,.2f}",
                "shipping": f"${tship:,.2f}",
                "taxes": f"${ttax:,.2f}",
                "totalSales": f"${tsales:,.2f}"
            })

        # 2. COGS & Profitability Report
        total_cogs = SupplierOrder.objects.aggregate(total=Sum('supplier_cost'))['total'] or Decimal('0.00')

        # 3. Returns Audit
        returns_count = ReturnRequest.objects.count()

        return Response({
            "summary": {
                "totalGlobalSales": float(total_global_sales),
                "totalOrders": Order.objects.count(),
                "totalCogs": float(total_cogs),
                "totalReturns": returns_count
            },
            "salesByLocation": {
                "donutData": donut_slices,
                "tableRows": location_rows
            }
        })
