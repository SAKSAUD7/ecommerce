import os
from django.core.management.base import BaseCommand
from django.utils.timezone import now
from datetime import timedelta
from authentication.models import User, Address
from products.models import Category, Collection, Product, ProductVariant, ProductImage, Review, Wishlist, Brand
from orders.models import Coupon
from cms.models import HeroSlider, Lookbook, LookbookItem, BlogPost

class Command(BaseCommand):
    help = "Seeds the database with premium luxury fashion ecommerce data."

    def handle(self, *args, **options):
        self.stdout.write("Cleaning database...")
        BlogPost.objects.all().delete()
        HeroSlider.objects.all().delete()
        LookbookItem.objects.all().delete()
        Lookbook.objects.all().delete()
        Coupon.objects.all().delete()
        Review.objects.all().delete()
        ProductImage.objects.all().delete()
        ProductVariant.objects.all().delete()
        Product.objects.all().delete()
        Collection.objects.all().delete()
        Brand.objects.all().delete()
        Category.objects.all().delete()
        Address.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        self.stdout.write("Creating users...")
        if not User.objects.filter(username="admin").exists():
            admin_user = User.objects.create_superuser(
                username="admin",
                email="admin@luxury.com",
                password="adminpassword123",
                is_admin=True,
                is_seller=True
            )
            self.stdout.write(f"Superuser 'admin' created.")
        else:
            admin_user = User.objects.get(username="admin")

        customer_user = User.objects.create_user(
            username="customer",
            email="customer@gmail.com",
            password="customerpassword123",
            is_customer=True,
            phone="+1234567890",
            rewards_points=500
        )
        self.stdout.write(f"Test Customer 'customer' created.")

        Address.objects.create(
            user=customer_user,
            full_name="Sarah Jenkins",
            phone="+1234567890",
            street_address="742 Evergreen Terrace",
            city="Springfield",
            state="IL",
            postal_code="62704",
            country="United States",
            is_default_shipping=True,
            is_default_billing=True
        )

        self.stdout.write("Creating brands...")
        brand_aurelia = Brand.objects.create(
            name="Maison Aurelia",
            slug="maison-aurelia",
            description="Established in Paris, Maison Aurelia redefines modern elegance with structured leather goods and timeless craftsmanship.",
            country="France"
        )
        brand_elan = Brand.objects.create(
            name="Maison Élan",
            slug="maison-elan",
            description="Avant-garde luxury. Combining traditional Italian leatherworking with bold, architectural silhouettes.",
            country="Italy"
        )
        brand_valere = Brand.objects.create(
            name="Valère Paris",
            slug="valere-paris",
            description="Understated luxury. Classic, soft leathers and minimal hardware for the contemporary sophisticated lifestyle.",
            country="France"
        )

        self.stdout.write("Creating categories...")
        accessories = Category.objects.create(name="Accessories", slug="accessories", description="Finely crafted bags, eyewear, and chronographs.")
        bags = Category.objects.create(name="Handbags", slug="handbags", parent=accessories, description="Luxury handbags, totes, and clutches.")
        
        totes = Category.objects.create(name="Totes", slug="totes", parent=bags, description="Spacious and elegant everyday totes.")
        shoulder_bags = Category.objects.create(name="Shoulder Bags", slug="shoulder-bags", parent=bags, description="Classic shoulder bags for effortless style.")
        crossbody = Category.objects.create(name="Crossbody", slug="crossbody", parent=bags, description="Hands-free luxury for the modern lifestyle.")
        top_handle = Category.objects.create(name="Top Handle", slug="top-handle", parent=bags, description="Structured top handle bags for sophisticated occasions.")

        self.stdout.write("Creating collections...")
        new_arrivals = Collection.objects.create(name="New Arrivals", slug="new-arrivals", description="The latest additions to our curated luxury catalog.")
        evening_edit = Collection.objects.create(name="The Evening Edit", slug="evening-edit", description="Elegant clutches and mini bags perfect for after-dark.")
        everyday_luxury = Collection.objects.create(name="Everyday Luxury", slug="everyday-luxury", description="Versatile, premium pieces designed for daily wear.")

        self.stdout.write("Creating products & variants...")
        
        # 1. Aurelia Classic Top Handle
        p1 = Product.objects.create(
            name="Aurelia Classic Top Handle",
            slug="aurelia-classic-top-handle",
            brand=brand_aurelia,
            description="Crafted in supple Italian leather, the Aurelia Classic Top Handle balances sculptural structure with understated elegance. A polished clasp and softly curved silhouette make it equally suited to daytime tailoring and evening occasions. Featuring a detachable shoulder strap and gold-tone hardware.",
            base_price=1850.00,
            category=top_handle
        )
        p1.collections.add(new_arrivals, everyday_luxury)
        
        pv1_1 = ProductVariant.objects.create(product=p1, name="Noir / Standard", sku="MAC-TH-NOIR", stock=15, size="Standard", color="Noir", color_hex="#111111", material="Calfskin Leather")
        pv1_2 = ProductVariant.objects.create(product=p1, name="Crème / Standard", sku="MAC-TH-CREME", stock=8, size="Standard", color="Crème", color_hex="#F5F5DC", material="Calfskin Leather")
        
        ProductImage.objects.create(product=p1, variant=pv1_1, image_url="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800", is_featured=True, order=0)
        ProductImage.objects.create(product=p1, variant=pv1_2, image_url="https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800", is_featured=False, order=1)

        # 2. Aurelia Milano Shoulder
        p2 = Product.objects.create(
            name="Aurelia Milano Shoulder Bag",
            slug="aurelia-milano-shoulder",
            brand=brand_aurelia,
            description="The Milano Shoulder Bag epitomizes quiet luxury. Designed with a soft, slouchy profile in premium suede, it features a signature brass chain link strap that rests perfectly on the shoulder.",
            base_price=1250.00,
            category=shoulder_bags
        )
        p2.collections.add(everyday_luxury)
        
        pv2_1 = ProductVariant.objects.create(product=p2, name="Caramel / Standard", sku="MAM-SH-CARA", stock=12, size="Standard", color="Caramel", color_hex="#8B4513", material="Suede")
        
        ProductImage.objects.create(product=p2, variant=pv2_1, image_url="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800", is_featured=True, order=0)

        # 3. Élan Architectural Crossbody
        p3 = Product.objects.create(
            name="Élan Architectural Crossbody",
            slug="elan-architectural-crossbody",
            brand=brand_elan,
            description="A masterpiece of modern design. The Architectural Crossbody features sharp, geometric lines in smooth calf leather. Its minimalist exterior opens to reveal a surprisingly spacious interior, complete with an adjustable strap.",
            base_price=950.00,
            category=crossbody
        )
        p3.collections.add(new_arrivals)
        
        pv3_1 = ProductVariant.objects.create(product=p3, name="Optic White / Mini", sku="EAC-OW-MINI", stock=20, size="Mini", color="Optic White", color_hex="#FFFFFF", material="Smooth Calf Leather")
        pv3_2 = ProductVariant.objects.create(product=p3, name="Optic White / Standard", sku="EAC-OW-STD", price_override=1150.00, stock=5, size="Standard", color="Optic White", color_hex="#FFFFFF", material="Smooth Calf Leather")
        
        ProductImage.objects.create(product=p3, variant=pv3_1, image_url="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800", is_featured=True, order=0)

        # 4. Valère Signature Tote
        p4 = Product.objects.create(
            name="Valère Signature Tote",
            slug="valere-signature-tote",
            brand=brand_valere,
            description="The ultimate everyday companion. The Valère Signature Tote offers an expansive interior lined with soft micro-suede, capable of holding a 14-inch laptop. Hand-stitched handles and a subtle embossed logo complete the look.",
            base_price=1450.00,
            category=totes
        )
        p4.collections.add(everyday_luxury)
        
        pv4_1 = ProductVariant.objects.create(product=p4, name="Taupe / Large", sku="VST-TAU-L", stock=30, size="Large", color="Taupe", color_hex="#483C32", material="Pebbled Leather")
        
        ProductImage.objects.create(product=p4, variant=pv4_1, image_url="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800", is_featured=True, order=0)

        # 5. Aurelia Mini Evening Clutch
        p5 = Product.objects.create(
            name="Aurelia Mini Evening Clutch",
            slug="aurelia-mini-evening-clutch",
            brand=brand_aurelia,
            description="Designed for the night. This exquisite mini clutch features a rigid frame wrapped in glossy patent leather. Accented with a geometric gold closure and a hidden chain strap for versatile styling.",
            base_price=850.00,
            category=bags
        )
        p5.collections.add(evening_edit)
        
        pv5_1 = ProductVariant.objects.create(product=p5, name="Ruby Red / Micro", sku="AMEC-RR-MIC", stock=4, size="Micro", color="Ruby Red", color_hex="#9B111E", material="Patent Leather")
        pv5_2 = ProductVariant.objects.create(product=p5, name="Onyx / Micro", sku="AMEC-ONX-MIC", stock=6, size="Micro", color="Onyx", color_hex="#000000", material="Patent Leather")
        
        ProductImage.objects.create(product=p5, variant=pv5_1, image_url="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800", is_featured=True, order=0)

        self.stdout.write("Creating reviews...")
        Review.objects.create(product=p1, user=customer_user, rating=5, title="Absolutely flawless", comment="The leather quality is incredible. It looks even better in person than online.", verified_purchase=True)
        Review.objects.create(product=p4, user=customer_user, rating=4, title="Perfect work bag", comment="Fits everything I need for the office while looking incredibly chic.", verified_purchase=True)

        self.stdout.write("Creating coupons...")
        Coupon.objects.create(
            code="LUXURY20",
            discount_type="percentage",
            value=20.00,
            active=True,
            valid_from=now(),
            valid_to=now() + timedelta(days=365)
        )

        self.stdout.write("Creating CMS content...")
        HeroSlider.objects.create(
            title="THE AURELIA COLLECTION",
            subtitle="Discover the pinnacle of modern structural design and quiet luxury.",
            cta_text="Shop the Collection",
            cta_link="/collections/new-arrivals",
            image_url="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600",
            order=0
        )
        HeroSlider.objects.create(
            title="EVERYDAY ELEGANCE",
            subtitle="Timeless leather goods crafted for the contemporary lifestyle.",
            cta_text="Explore Totes",
            cta_link="/collections/everyday-luxury",
            image_url="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1600",
            order=1
        )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully with Luxury Handbags demo catalog!"))
