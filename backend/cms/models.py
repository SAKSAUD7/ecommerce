from django.db import models
from django.utils.text import slugify
from products.models import Product

class Lookbook(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    cover_image_url = models.URLField(max_length=500)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class LookbookItem(models.Model):
    lookbook = models.ForeignKey(Lookbook, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    x_position = models.FloatField(help_text="Hotspot position X percentage (0-100)")
    y_position = models.FloatField(help_text="Hotspot position Y percentage (0-100)")

    def __str__(self):
        return f"Hotspot on {self.lookbook.title} for {self.product.name}"

class HeroSlider(models.Model):
    title = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=250, blank=True, null=True)
    cta_text = models.CharField(max_length=50, default="Shop Collection")
    cta_link = models.CharField(max_length=200, default="/shop")
    image_url = models.URLField(max_length=500)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    summary = models.TextField()
    content = models.TextField()
    cover_image_url = models.URLField(max_length=500)
    author_name = models.CharField(max_length=100, default="Antigravity Editorial")
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class StoreSettings(models.Model):
    store_name = models.CharField(max_length=150, default="Aura")
    support_email = models.EmailField(default="support@aura.com")
    support_phone = models.CharField(max_length=50, blank=True, null=True)
    currency = models.CharField(max_length=10, default="USD")
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=8.00, help_text="Percentage tax rate")
    flat_shipping_rate = models.DecimalField(max_digits=10, decimal_places=2, default=25.00)
    free_shipping_threshold = models.DecimalField(max_digits=10, decimal_places=2, default=1000.00)
    
    def save(self, *args, **kwargs):
        # Enforce singleton pattern
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Global Store Settings"

class Page(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    is_published = models.BooleanField(default=True)
    meta_title = models.CharField(max_length=150, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class PageSection(models.Model):
    SECTION_TYPES = (
        ('hero', 'Hero Banner'),
        ('featured_products', 'Featured Products'),
        ('text_image', 'Text with Image'),
        ('newsletter', 'Newsletter Signup'),
        ('custom_html', 'Custom HTML'),
    )
    
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='sections')
    section_type = models.CharField(max_length=50, choices=SECTION_TYPES)
    title = models.CharField(max_length=150, blank=True, null=True)
    content = models.JSONField(default=dict, help_text="JSON payload containing section specific data (e.g., image_url, text, product_ids)")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.page.title} - {self.get_section_type_display()} (Order: {self.order})"

