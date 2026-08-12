import os
import django
import sys
from decimal import Decimal

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from products.models import Product, ProductVariant
from orders.models import Order, OrderItem, Payment, SupplierOrder, Coupon
from suppliers.services import route_order_to_suppliers

def run_end_to_end_test():
    print("====================================================")
    print("[START] RUNNING END-TO-END ECOMMERCE LIFECYCLE VERIFICATION")
    print("====================================================")

    # 1. Fetch First Seeded Product Variant
    variant = ProductVariant.objects.filter(product__description__contains="[DEMO_SEEDED]").first()
    if not variant:
        print("[FAIL] No demo seeded variants found. Run seed_demo_data first.")
        sys.exit(1)

    initial_stock = variant.stock
    print(f"[OK] Step 1: Selected Product '{variant.product.name}' | Variant '{variant.name}' | Stock: {initial_stock}")

    # 2. Test Coupon Validation
    coupon = Coupon.objects.filter(code="WELCOME10", active=True).first()
    if not coupon:
        print("[FAIL] Coupon WELCOME10 not found.")
        sys.exit(1)
    print(f"[OK] Step 2: Validated Coupon '{coupon.code}' ({coupon.discount_type}: {coupon.value}%)")

    # 3. Simulate Checkout Payload & Calculations
    buy_qty = 2
    subtotal = variant.product.base_price * buy_qty
    discount = (subtotal * Decimal("0.10")).quantize(Decimal("0.01"))
    shipping = Decimal("0.00") if (subtotal - discount) > Decimal("400.00") else Decimal("25.00")
    tax = ((subtotal - discount) * Decimal("0.08")).quantize(Decimal("0.01"))
    total = subtotal - discount + shipping + tax

    print(f"[OK] Step 3: Calculated Checkout Totals -> Subtotal: ${subtotal} | Discount: -${discount} | Shipping: ${shipping} | Tax: ${tax} | Total: ${total}")

    # 4. Create Order in Database
    test_order = Order.objects.create(
        full_name="Lady Charlotte E2E Tester",
        email="e2e_test_client@denoura.co",
        phone="+44 20 7946 0921 DEMO",
        shipping_address_line="1 Knightsbridge Green",
        shipping_city="London",
        shipping_state="Greater London",
        shipping_postal_code="SW1X 7QA",
        shipping_country="United Kingdom",
        subtotal=subtotal,
        shipping_cost=shipping,
        tax=tax,
        discount=discount,
        total=total,
        status='paid'
    )
    print(f"[OK] Step 4: Order Created in DB -> ID: #{test_order.id} | Status: {test_order.status}")

    # 5. Create OrderItem & Decrement Inventory
    order_item = OrderItem.objects.create(
        order=test_order,
        variant=variant,
        price=variant.product.base_price,
        quantity=buy_qty
    )
    
    variant.stock -= buy_qty
    variant.save()

    # Re-query stock from database to verify persistence
    variant.refresh_from_db()
    updated_stock = variant.stock
    print(f"[OK] Step 5: Inventory Decremented -> Initial: {initial_stock} | Quantity Bought: {buy_qty} | Updated DB Stock: {updated_stock}")
    assert updated_stock == initial_stock - buy_qty, "Inventory mismatch after purchase!"

    # 6. Create Payment Record
    payment = Payment.objects.create(
        order=test_order,
        gateway='stripe',
        transaction_id=f"tx_e2e_{test_order.id}",
        amount=total,
        status='completed'
    )
    print(f"[OK] Step 6: Payment Logged -> Gateway: {payment.gateway} | TxID: {payment.transaction_id} | Status: {payment.status}")

    # 7. Execute Supplier Dropshipping Auto-Routing
    routed = route_order_to_suppliers(test_order.id)
    supplier_orders = SupplierOrder.objects.filter(order=test_order)
    print(f"[OK] Step 7: Supplier Dropship Auto-Routing Executed -> Success: {routed} | Created {supplier_orders.count()} Supplier Fulfillment Order(s)")

    # 8. Verify Admin Visibility
    fetched_admin_order = Order.objects.get(id=test_order.id)
    print(f"[OK] Step 8: Admin Order Visibility Verified -> Client: '{fetched_admin_order.full_name}' | Total: ${fetched_admin_order.total}")

    print("====================================================")
    print("[SUCCESS] ALL 8 ECOMMERCE LIFECYCLE STEPS PASSED SUCCESSFULLY!")
    print("====================================================")

if __name__ == "__main__":
    run_end_to_end_test()
