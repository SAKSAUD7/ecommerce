from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Location, InventoryLevel, InventoryMovement
from .serializers import LocationSerializer, InventoryLevelSerializer, InventoryMovementSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAdminUser]

class InventoryLevelViewSet(viewsets.ModelViewSet):
    queryset = InventoryLevel.objects.all()
    serializer_class = InventoryLevelSerializer
    permission_classes = [IsAdminUser]

class InventoryMovementViewSet(viewsets.ModelViewSet):
    queryset = InventoryMovement.objects.all()
    serializer_class = InventoryMovementSerializer
    permission_classes = [IsAdminUser]
