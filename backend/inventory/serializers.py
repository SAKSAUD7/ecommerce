from rest_framework import serializers
from .models import Location, InventoryLevel, InventoryMovement, PurchaseOrder, PurchaseOrderItem
from suppliers.serializers import SupplierSerializer
from products.serializers import ProductVariantSerializer

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class InventoryLevelSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(), source='location', write_only=True
    )
    class Meta:
        model = InventoryLevel
        fields = '__all__'

class InventoryMovementSerializer(serializers.ModelSerializer):
    variant_name = serializers.CharField(source='variant.product.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)

    class Meta:
        model = InventoryMovement
        fields = '__all__'

class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    variant_details = ProductVariantSerializer(source='variant', read_only=True)

    class Meta:
        model = PurchaseOrderItem
        fields = ('id', 'variant', 'variant_details', 'quantity_ordered', 'quantity_received', 'cost_price')

class PurchaseOrderSerializer(serializers.ModelSerializer):
    supplier_details = SupplierSerializer(source='supplier', read_only=True)
    items = PurchaseOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = (
            'id', 'supplier', 'supplier_details', 'status',
            'expected_delivery', 'tracking_number', 'total_cost',
            'notes', 'items', 'created_at', 'updated_at'
        )

