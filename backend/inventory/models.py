from django.db import models
from products.models import ProductVariant

class Location(models.Model):
    name = models.CharField(max_length=150)
    address = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class InventoryLevel(models.Model):
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='inventory_levels')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='inventory_levels')
    available = models.IntegerField(default=0)
    reserved = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('variant', 'location')
        
    def __str__(self):
        return f"{self.variant.name} at {self.location.name}: {self.available} available"

class InventoryMovement(models.Model):
    MOVEMENT_TYPES = (
        ('purchase', 'Purchase'),
        ('sale', 'Sale'),
        ('return', 'Return'),
        ('transfer', 'Transfer'),
        ('adjustment', 'Adjustment'),
    )
    
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='inventory_movements')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='inventory_movements')
    movement_type = models.CharField(max_length=50, choices=MOVEMENT_TYPES)
    quantity = models.IntegerField()
    reference = models.CharField(max_length=100, blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.movement_type} of {self.quantity} {self.variant.name} at {self.location.name}"

class PurchaseOrder(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('sent', 'Sent to Supplier'),
        ('partial', 'Partially Received'),
        ('received', 'Received & Stocked'),
        ('cancelled', 'Cancelled'),
    )
    supplier = models.ForeignKey('suppliers.Supplier', on_delete=models.CASCADE, related_name='purchase_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    expected_delivery = models.DateField(null=True, blank=True)
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"PO #{self.id} - {self.supplier.name} ({self.status})"

class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity_ordered = models.PositiveIntegerField(default=1)
    quantity_received = models.PositiveIntegerField(default=0)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"PO Item {self.variant.product.name} (Qty {self.quantity_ordered})"
