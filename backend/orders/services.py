from .models import Order, OrderItem, SupplierOrder, SupplierOrderItem
from suppliers.models import SupplierProduct

class OrderRoutingService:
    @staticmethod
    def route_order(order_id):
        """
        Evaluate items in an order and route them to optimal suppliers.
        Creates SupplierOrder and SupplierOrderItem records.
        """
        order = Order.objects.get(id=order_id)
        
        # Group items by optimal supplier
        supplier_assignments = {} # supplier_id -> list of (order_item, supplier_product)
        unfulfilled_items = []
        
        for item in order.items.all():
            # Find active suppliers for this variant with stock
            supplier_products = SupplierProduct.objects.filter(
                variant=item.variant,
                is_active=True,
                stock_available__gte=item.quantity
            ).order_by('cost_price', 'shipping_time_days')
            
            if supplier_products.exists():
                # Pick the cheapest supplier first (basic routing algorithm)
                # Future enhancements: consider SLA score, shipping destination, etc.
                best_supplier_product = supplier_products.first()
                supplier_id = best_supplier_product.supplier.id
                
                if supplier_id not in supplier_assignments:
                    supplier_assignments[supplier_id] = []
                
                supplier_assignments[supplier_id].append((item, best_supplier_product))
                
                # Reserve stock (optional, depending on architecture)
                best_supplier_product.stock_available -= item.quantity
                best_supplier_product.save()
            else:
                unfulfilled_items.append(item)
                
        # Create Supplier Orders
        supplier_orders_created = []
        for supplier_id, assignments in supplier_assignments.items():
            total_supplier_cost = sum(sp.cost_price * item.quantity for item, sp in assignments)
            
            supplier_order = SupplierOrder.objects.create(
                order=order,
                supplier_id=supplier_id,
                status='pending',
                supplier_cost=total_supplier_cost
            )
            supplier_orders_created.append(supplier_order)
            
            for item, sp in assignments:
                SupplierOrderItem.objects.create(
                    supplier_order=supplier_order,
                    order_item=item,
                    cost_price=sp.cost_price
                )
                
        return {
            "routed_orders": len(supplier_orders_created),
            "unfulfilled_items": len(unfulfilled_items)
        }
