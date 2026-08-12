from django.db import models
from products.models import ProductVariant

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    contact_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    # Performance metrics
    score = models.IntegerField(default=100, help_text="Supplier performance score out of 100")
    fulfillment_sla_hours = models.IntegerField(default=48, help_text="SLA for fulfilling an order in hours")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class SupplierProduct(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='products')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='supplier_details')
    
    supplier_sku = models.CharField(max_length=100, blank=True, null=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Cost to purchase from supplier")
    stock_available = models.IntegerField(default=0)
    
    processing_time_days = models.IntegerField(default=2)
    shipping_time_days = models.IntegerField(default=7)
    
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('supplier', 'variant')
        
    def __str__(self):
        return f"{self.supplier.name} - {self.variant.name}"
