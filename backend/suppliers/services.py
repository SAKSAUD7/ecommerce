from decimal import Decimal
from django.db import transaction
from orders.models import Order, OrderItem, SupplierOrder, SupplierOrderItem
from suppliers.models import SupplierProduct

@transaction.atomic
def route_order_to_suppliers(order_id):
    """
    Automated routing logic to assign OrderItems to the optimal Supplier.
    Optimization strategy: Lowest cost first, if stock is available.
    """
    order = Order.objects.get(id=order_id)
    
    # Skip if already routed
    if order.supplier_orders.exists():
        return False

    items = order.items.all()
    supplier_allocations = {}  # {supplier_id: [order_item, cost, ...]}

    for item in items:
        # Find all active suppliers that carry this variant and have stock
        potential_suppliers = SupplierProduct.objects.filter(
            variant=item.variant,
            is_active=True,
            stock_available__gte=item.quantity
        ).order_by('cost_price') # Cheapest first

        if not potential_suppliers.exists():
            # Fallback: if no supplier has stock, just pick the cheapest one anyway to backorder
            potential_suppliers = SupplierProduct.objects.filter(
                variant=item.variant,
                is_active=True
            ).order_by('cost_price')

        if not potential_suppliers.exists():
            # Critical error: No supplier sells this product
            continue

        # Pick the best supplier (cheapest)
        best_supplier_product = potential_suppliers.first()
        supplier = best_supplier_product.supplier
        
        if supplier.id not in supplier_allocations:
            supplier_allocations[supplier.id] = []
            
        supplier_allocations[supplier.id].append({
            'order_item': item,
            'cost_price': best_supplier_product.cost_price,
            'supplier_product': best_supplier_product
        })

    # Create Supplier Orders
    for supplier_id, allocation_items in supplier_allocations.items():
        # Calculate totals
        total_supplier_cost = sum(alloc['cost_price'] * alloc['order_item'].quantity for alloc in allocation_items)
        
        # In a real scenario, shipping cost would be calculated per supplier.
        # Here we just put a flat fallback or zero.
        total_shipping_cost = Decimal('0.00')

        # Create SupplierOrder
        supplier_order = SupplierOrder.objects.create(
            order=order,
            supplier_id=supplier_id,
            status='pending',
            supplier_cost=total_supplier_cost,
            shipping_cost=total_shipping_cost
        )
        
        for alloc in allocation_items:
            SupplierOrderItem.objects.create(
                supplier_order=supplier_order,
                order_item=alloc['order_item'],
                cost_price=alloc['cost_price']
            )
            
            # Deduct stock from the supplier
            sp = alloc['supplier_product']
            sp.stock_available -= alloc['order_item'].quantity
            sp.save()
            
    return True
