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
    help = "Seed comprehensive realistic luxury bag & couture demo catalog, variants, orders, returns & coupons (Reversible via --clear)"

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

            # Clean up demo coupons
            Coupon.objects.filter(code__in=["WELCOME10", "FREESHIP", "LUXE20"]).delete()

            # Clean up demo products
            demo_products = Product.objects.filter(description__contains="[DEMO_SEEDED]")
            ProductVariant.objects.filter(product__in=demo_products).delete()
            ProductImage.objects.filter(product__in=demo_products).delete()
            demo_products.delete()

            self.stdout.write(self.style.SUCCESS("[OK] Successfully flushed all demo data!"))
            return

        self.stdout.write(self.style.MIGRATE_HEADING("Seeding DE'NOURA 35+ luxury bag products, collections, suppliers, orders & coupons..."))

        # 1. Seed Categories
        cat_totes, _ = Category.objects.get_or_create(name="Tote Bags", defaults={"slug": "tote-bags"})
        cat_shoulder, _ = Category.objects.get_or_create(name="Shoulder Bags", defaults={"slug": "shoulder-bags"})
        cat_crossbody, _ = Category.objects.get_or_create(name="Crossbody Bags", defaults={"slug": "crossbody-bags"})
        cat_clutches, _ = Category.objects.get_or_create(name="Evening Clutches", defaults={"slug": "evening-clutches"})
        cat_tophandle, _ = Category.objects.get_or_create(name="Top Handle Bags", defaults={"slug": "top-handle-bags"})
        cat_mini, _ = Category.objects.get_or_create(name="Mini Bags", defaults={"slug": "mini-bags"})
        cat_modest, _ = Category.objects.get_or_create(name="Modest Luxury Abayas", defaults={"slug": "modest-luxury"})
        cat_silk, _ = Category.objects.get_or_create(name="Silk Accessories", defaults={"slug": "silk-accessories"})

        # 2. Seed Collections
        col_sig, _ = Collection.objects.get_or_create(name="Signature Collection", defaults={"slug": "signature-collection"})
        col_aur, _ = Collection.objects.get_or_create(name="Aurelia Collection", defaults={"slug": "aurelia-collection"})
        col_new, _ = Collection.objects.get_or_create(name="New Arrivals", defaults={"slug": "new-arrivals"})
        col_best, _ = Collection.objects.get_or_create(name="Best Sellers", defaults={"slug": "best-sellers"})

        # 3. Seed Brands
        brand_denoura, _ = Brand.objects.get_or_create(name="DE'NOURA Atelier", defaults={"slug": "denoura-atelier"})

        # 4. Seed Suppliers
        supplier_italy, _ = Supplier.objects.get_or_create(
            name="Florence Leather Guild Italy", 
            defaults={"email": "orders@florenceguild.it", "fulfillment_sla_hours": 48}
        )
        supplier_france, _ = Supplier.objects.get_or_create(
            name="Maison Aurelia Supply Co. France", 
            defaults={"email": "supply@maisonaurelia.fr", "fulfillment_sla_hours": 24}
        )

        # 5. Seed Coupons
        now = timezone.now()
        Coupon.objects.get_or_create(
            code="WELCOME10",
            defaults={"discount_type": "percentage", "value": Decimal("10.00"), "active": True, "valid_from": now, "valid_to": now + timedelta(days=365)}
        )
        Coupon.objects.get_or_create(
            code="FREESHIP",
            defaults={"discount_type": "flat", "value": Decimal("25.00"), "active": True, "valid_from": now, "valid_to": now + timedelta(days=365)}
        )
        Coupon.objects.get_or_create(
            code="LUXE20",
            defaults={"discount_type": "percentage", "value": Decimal("20.00"), "active": True, "valid_from": now, "valid_to": now + timedelta(days=365)}
        )

        # 6. Seed 35 Realistic Luxury Products Payload
        RAW_BAG_IMAGES = [
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f",
            "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3"
        ]

        products_catalog = [
            ("Aurelia Structured Leather Tote", "aurelia-structured-tote", "450.00", cat_totes, "120.00"),
            ("Celeste Quilted Shoulder Bag", "celeste-quilted-shoulder", "520.00", cat_shoulder, "145.00"),
            ("Élan Mini Top Handle Bag", "elan-mini-top-handle", "390.00", cat_tophandle, "100.00"),
            ("Valentina Chain Shoulder Bag", "valentina-chain-shoulder", "490.00", cat_shoulder, "130.00"),
            ("Solenne Structured Satchel", "solenne-structured-satchel", "410.00", cat_totes, "115.00"),
            ("Maison Leather Crossbody", "maison-leather-crossbody", "320.00", cat_crossbody, "85.00"),
            ("Aria Signature Shoulder Bag", "aria-signature-shoulder", "460.00", cat_shoulder, "125.00"),
            ("Elise Evening Velvet Clutch", "elise-evening-velvet-clutch", "299.00", cat_clutches, "75.00"),
            ("Noelle Crescent Leather Bag", "noelle-crescent-leather", "340.00", cat_shoulder, "95.00"),
            ("Camille Quilted Mini Bag", "camille-quilted-mini", "310.00", cat_mini, "80.00"),
            ("Amara Soft Italian Leather Tote", "amara-soft-leather-tote", "480.00", cat_totes, "135.00"),
            ("Serena Gold Chain Crossbody", "serena-gold-chain-crossbody", "380.00", cat_crossbody, "105.00"),
            ("Lucienne Top Handle Handbag", "lucienne-top-handle-handbag", "550.00", cat_tophandle, "155.00"),
            ("Vivienne Evening Minaudière", "vivienne-evening-minaudiere", "360.00", cat_clutches, "95.00"),
            ("Estelle Mini Quilted Bag", "estelle-mini-quilted", "280.00", cat_mini, "70.00"),
            ("Florence Monogram Satchel", "florence-monogram-satchel", "430.00", cat_totes, "120.00"),
            ("Bespoke Florentine Leather Duffel", "florentine-leather-duffel", "650.00", cat_totes, "180.00"),
            ("Palais Royal Velvet Envelope Clutch", "palais-royal-velvet-clutch", "270.00", cat_clutches, "70.00"),
            ("Opera Satin Evening Pouch", "opera-satin-evening-pouch", "220.00", cat_clutches, "55.00"),
            ("Sienna Woven Leather Tote", "sienna-woven-leather-tote", "490.00", cat_totes, "130.00"),
            ("Geneva Saddle Crossbody", "geneva-saddle-crossbody", "350.00", cat_crossbody, "95.00"),
            ("Capri Canvas & Leather Tote", "capri-canvas-leather-tote", "310.00", cat_totes, "85.00"),
            ("Monaco Patent Leather Clutch", "monaco-patent-leather-clutch", "340.00", cat_clutches, "90.00"),
            ("Verona Soft Hobo Shoulder Bag", "verona-soft-hobo-shoulder", "420.00", cat_shoulder, "110.00"),
            ("Riviera Structured Shopper", "riviera-structured-shopper", "460.00", cat_totes, "125.00"),
            ("Atelier Embossed Crocodile Satchel", "atelier-crocodile-satchel", "580.00", cat_tophandle, "160.00"),
            ("Luxe Monogram Mini Bucket Bag", "luxe-monogram-mini-bucket", "370.00", cat_mini, "100.00"),
            ("Olympia Gold Clasp Crossbody", "olympia-gold-clasp-crossbody", "410.00", cat_crossbody, "115.00"),
            ("Savoy Pebbled Leather Shoulder Bag", "savoy-pebbled-leather-shoulder", "440.00", cat_shoulder, "120.00"),
            ("Vienne Flap Shoulder Bag", "vienne-flap-shoulder", "390.00", cat_shoulder, "105.00"),
            ("Astrid Oversized Leather Tote", "astrid-oversized-leather-tote", "520.00", cat_totes, "145.00"),
            ("Bellis Silk Evening Bag", "bellis-silk-evening-bag", "260.00", cat_clutches, "65.00"),
            ("Mirabelle Framed Top Handle Bag", "mirabelle-framed-top-handle", "470.00", cat_tophandle, "130.00"),
            ("Corinthian Studded Leather Clutch", "corinthian-studded-clutch", "330.00", cat_clutches, "85.00"),
            ("Haute Modest Silk Couture Abaya", "haute-modest-silk-couture-abaya", "480.00", cat_modest, "140.00")
        ]

        created_variants = []

        for idx, (pname, pslug, pprice, pcat, pcogs) in enumerate(products_catalog):
            img_url = RAW_BAG_IMAGES[idx % len(RAW_BAG_IMAGES)]
            
            prod, _ = Product.objects.get_or_create(
                slug=f"{pslug}-demo",
                defaults={
                    "name": pname,
                    "description": f"Master Florentine leather craftsmanship piece. Hand-stitched full-grain calfskin leather with 24k gold-plated monogram lock. [DEMO_SEEDED]",
                    "base_price": Decimal(pprice),
                    "category": pcat,
                    "brand": brand_denoura,
                    "is_active": True
                }
            )
            ProductImage.objects.get_or_create(product=prod, image_url=img_url, defaults={"is_featured": True})

            # Variants: Noir Black & Monogram Gold
            v1_stock = 0 if idx == 4 else (3 if idx == 9 else 35)
            variant1, _ = ProductVariant.objects.get_or_create(
                product=prod,
                sku=f"DN-{idx+1:03d}-BLK",
                defaults={
                    "name": f"Noir Black / Standard",
                    "price_override": None,
                    "stock": v1_stock,
                    "color": "Noir Black",
                    "size": "Standard"
                }
            )
            created_variants.append((variant1, Decimal(pcogs)))

            SupplierProduct.objects.get_or_create(
                variant=variant1,
                supplier=supplier_italy if idx % 2 == 0 else supplier_france,
                defaults={"supplier_sku": f"FLOR-DN-{idx+1:03d}-BLK", "cost_price": Decimal(pcogs), "stock_available": v1_stock}
            )

        # 7. Seed Demo Orders across various countries over the last 30 days
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
            subtotal = variant_sample.product.base_price * qty
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
                price=variant_sample.product.base_price,
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
                supplier=supplier_italy if i % 2 == 0 else supplier_france,
                status='fulfilled',
                supplier_cost=cogs_val * qty,
                shipping_cost=Decimal("15.00"),
                tracking_number=f"DHL-DEMO-{order.id}992"
            )

            if i in [5, 18]:
                ReturnRequest.objects.create(
                    order=order,
                    reason="defective",
                    explanation="Size exchange requested",
                    refund_amount=total,
                    status='approved'
                )

        self.stdout.write(self.style.SUCCESS("[OK] Successfully seeded 35 luxury products, variants, suppliers, coupons, and 45 demo orders with real metrics!"))
        self.stdout.write(self.style.NOTICE("To wipe demo data in the future, run: python manage.py seed_demo_data --clear"))
