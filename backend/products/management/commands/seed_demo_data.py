import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from products.models import Category, Collection, Brand, Product, ProductVariant, ProductImage, Review
from orders.models import Order, OrderItem, Payment, ReturnRequest, SupplierOrder, Coupon
from suppliers.models import Supplier, SupplierProduct

DEMO_TAG = "[DEMO_SEEDED]"

class Command(BaseCommand):
    help = "Seed realistic demo products, variants, orders, returns, and analytics data (Reversible via --clear)"

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Delete all seeded demo data from the database cleanly.',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING("Clearing all seeded demo data..."))
            
            # Clean up orders & return requests created by demo seeder
            demo_orders = Order.objects.filter(phone__contains="DEMO")
            ReturnRequest.objects.filter(order__in=demo_orders).delete()
            Payment.objects.filter(order__in=demo_orders).delete()
            OrderItem.objects.filter(order__in=demo_orders).delete()
            SupplierOrder.objects.filter(order__in=demo_orders).delete()
            demo_orders.delete()

            # Clean up demo products
            demo_products = Product.objects.filter(description__contains="[DEMO_SEEDED]")
            ProductVariant.objects.filter(product__in=demo_products).delete()
            ProductImage.objects.filter(product__in=demo_products).delete()
            demo_products.delete()

            self.stdout.write(self.style.SUCCESS("✓ Successfully flushed all demo data!"))
            return

        self.stdout.write(self.style.MIGRATE_HEADING("Seeding DE'NOURA demo products, variants, orders & analytics data..."))

        # 1. Seed Categories
        cat_handbags, _ = Category.objects.get_or_create(name="Handbags & Totes", defaults={"slug": "handbags-totes"})
        cat_clutches, _ = Category.objects.get_or_create(name="Evening Clutches", defaults={"slug": "evening-clutches"})
        cat_modest, _ = Category.objects.get_or_create(name="Modest Luxury Abayas", defaults={"slug": "modest-luxury"})
        cat_silk, _ = Category.objects.get_or_create(name="Silk Accessories", defaults={"slug": "silk-accessories"})

        # 2. Seed Brand
        brand_denoura, _ = Brand.objects.get_or_create(name="DE'NOURA Atelier", defaults={"slug": "denoura-atelier"})

        # 3. Seed Supplier
        supplier_italy, _ = Supplier.objects.get_or_create(
            name="Florence Leather Guild Italy", 
            defaults={"email": "orders@florenceguild.it", "fulfillment_sla_hours": 48}
        )

        # 4. Seed Products
        products_payload = [
          {
            "name": "DE'NOURA Master Leather Tote",
            "slug": "denoura-master-tote-demo",
            "price": "450.00",
            "category": cat_handbags,
            "img": "https://images.unsplash.com/photo-1583391733956-6c78276477e2",
            "cogs": "120.00",
            "variants": [
              {"name": "Noir Black / Standard", "sku": "DN-TOT-BLK", "stock": 45, "color": "Noir Black", "size": "Standard"},
              {"name": "Monogram Gold / Grande", "sku": "DN-TOT-GLD", "stock": 30, "color": "Monogram Gold", "size": "Grande"}
            ]
          },
          {
            "name": "Royal Velvet Evening Clutch",
            "slug": "royal-velvet-clutch-demo",
            "price": "299.00",
            "category": cat_clutches,
            "img": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
            "cogs": "85.00",
            "variants": [
              {"name": "Emerald Green / One Size", "sku": "DN-CLU-EMR", "stock": 25, "color": "Emerald Green", "size": "Standard"},
              {"name": "Royal Navy / One Size", "sku": "DN-CLU-NVY", "stock": 40, "color": "Royal Navy", "size": "Standard"}
            ]
          },
          {
            "name": "Italian Silk Crossbody Bag",
            "slug": "italian-silk-crossbody-demo",
            "price": "320.00",
            "category": cat_handbags,
            "img": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b",
            "cogs": "90.00",
            "variants": [
              {"name": "Caramel Tan / Standard", "sku": "DN-CRB-TAN", "stock": 35, "color": "Caramel Tan", "size": "Standard"}
            ]
          },
          {
            "name": "Haute Modest Silk Abaya",
            "slug": "haute-modest-silk-abaya-demo",
            "price": "480.00",
            "category": cat_modest,
            "img": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
            "cogs": "140.00",
            "variants": [
              {"name": "Black Silk / Medium", "sku": "DN-ABY-M", "stock": 20, "color": "Black", "size": "M"},
              {"name": "Black Silk / Large", "sku": "DN-ABY-L", "stock": 15, "color": "Black", "size": "L"}
            ]
          }
        ]

        created_variants = []

        for pdata in products_payload:
            prod, _ = Product.objects.get_or_create(
                slug=pdata['slug'],
                defaults={
                    "name": pdata['name'],
                    "description": f"Master craftsmanship piece. [DEMO_SEEDED]",
                    "base_price": Decimal(pdata['price']),
                    "category": pdata['category'],
                    "brand": brand_denoura,
                    "is_active": True
                }
            )
            ProductImage.objects.get_or_create(product=prod, image_url=pdata['img'], defaults={"is_featured": True})
            
            for vdata in pdata['variants']:
                variant, _ = ProductVariant.objects.get_or_create(
                    product=prod,
                    sku=vdata['sku'],
                    defaults={
                        "name": vdata['name'],
                        "price_override": None,
                        "stock": vdata['stock'],
                        "color": vdata['color'],
                        "size": vdata['size']
                    }
                )
                created_variants.append((variant, Decimal(pdata['cogs'])))
                SupplierProduct.objects.get_or_create(
                    variant=variant,
                    supplier=supplier_italy,
                    defaults={"supplier_sku": f"FLOR-{vdata['sku']}", "cost_price": Decimal(pdata['cogs']), "stock_available": vdata['stock']}
                )

        # 5. Seed Demo Orders across various countries over the last 30 days
        demo_countries = [
            ("United Kingdom", "London", "SW1X 7QA"),
            ("Netherlands", "Amsterdam", "1012 JS"),
            ("Germany", "Berlin", "10115"),
            ("Sweden", "Stockholm", "111 22"),
            ("Switzerland", "Zurich", "8001"),
            ("France", "Paris", "75001"),
            ("United States", "New York", "10001"),
            ("United Arab Emirates", "Dubai", "00000")
        ]

        names_pool = ["Sarah Al-Mansoor", "Sophia Laurent", "Elena Rostova", "Lady Charlotte", "Zainab Chaudhry", "Emma Watson", "Amira El-Sayed", "Chloe Dubois"]

        now = timezone.now()
        for i in range(45):
            days_ago = random.randint(0, 28)
            order_date = now - timedelta(days=days_ago)
            country_name, city, postal = random.choice(demo_countries)

            variant_sample, cogs_val = random.choice(created_variants)
            qty = random.choice([1, 2])
            subtotal = variant_sample.price * qty
            shipping_cost = Decimal("0.00") if subtotal > Decimal("400.00") else Decimal("25.00")
            tax = (subtotal * Decimal("0.08")).quantize(Decimal("0.01"))
            total = subtotal + shipping_cost + tax

            order = Order.objects.create(
                full_name=random.choice(names_pool),
                email=f"client_{i+1}@denoura.co",
                phone=f"+44 7946 092{i:02d} DEMO",
                shipping_address_line=f"{random.randint(1, 99)} Royal Avenue",
                shipping_city=city,
                shipping_state="State",
                shipping_postal_code=postal,
                shipping_country=country_name,
                subtotal=subtotal,
                shipping_cost=shipping_cost,
                tax=tax,
                discount=Decimal("0.00"),
                total=total,
                status='paid'
            )
            order.created_at = order_date
            order.save()

            OrderItem.objects.create(
                order=order,
                variant=variant_sample,
                price=variant_sample.price,
                quantity=qty
            )

            Payment.objects.create(
                order=order,
                gateway='stripe' if i % 2 == 0 else 'paypal',
                transaction_id=f"tx_demo_{order.id}_{i}",
                amount=total,
                status='completed'
            )

            SupplierOrder.objects.create(
                order=order,
                supplier=supplier_italy,
                status='fulfilled',
                supplier_cost=cogs_val * qty,
                shipping_cost=Decimal("15.00"),
                tracking_number=f"DHL-DEMO-{order.id}992"
            )

            # Create demo returns for 2 orders
            if i in [5, 18]:
                ReturnRequest.objects.create(
                    order=order,
                    reason="Defective Fabric / Size Swap",
                    refund_amount=total,
                    status='approved'
                )

        self.stdout.write(self.style.SUCCESS("[OK] Successfully seeded products, variants, and 45 demo orders with real COGS, returns, and sales metrics!"))
        self.stdout.write(self.style.NOTICE("To wipe demo data in the future, run: python manage.py seed_demo_data --clear"))
