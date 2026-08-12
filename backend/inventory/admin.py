from django.contrib import admin
from .models import Location, InventoryLevel, InventoryMovement

admin.site.register(Location)
admin.site.register(InventoryLevel)
admin.site.register(InventoryMovement)
