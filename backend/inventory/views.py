from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Location, InventoryLevel, InventoryMovement, PurchaseOrder
from .serializers import LocationSerializer, InventoryLevelSerializer, InventoryMovementSerializer, PurchaseOrderSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAdminUser]

class InventoryLevelViewSet(viewsets.ModelViewSet):
    queryset = InventoryLevel.objects.all()
    serializer_class = InventoryLevelSerializer
    permission_classes = [IsAdminUser]

class InventoryMovementViewSet(viewsets.ModelViewSet):
    queryset = InventoryMovement.objects.all().order_by('-created_at')
    serializer_class = InventoryMovementSerializer
    permission_classes = [IsAdminUser]

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all().order_by('-created_at')
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAdminUser]

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status == 'received':
            for item in instance.items.all():
                item.variant.stock += item.quantity_ordered
                item.variant.save()
                default_location = Location.objects.filter(is_default=True).first() or Location.objects.first()
                if default_location:
                    InventoryMovement.objects.create(
                        variant=item.variant,
                        location=default_location,
                        movement_type='purchase',
                        quantity=item.quantity_ordered,
                        reference=f"PO #{instance.id}",
                        reason="Purchase order received and stocked"
                    )

