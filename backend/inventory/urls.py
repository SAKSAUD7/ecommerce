from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LocationViewSet, InventoryLevelViewSet, InventoryMovementViewSet

router = DefaultRouter()
router.register(r'locations', LocationViewSet)
router.register(r'levels', InventoryLevelViewSet)
router.register(r'movements', InventoryMovementViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
