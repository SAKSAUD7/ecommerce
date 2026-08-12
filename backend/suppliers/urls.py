from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminSupplierViewSet, AdminSupplierProductViewSet

router = DefaultRouter()
router.register(r'admin-suppliers', AdminSupplierViewSet, basename='admin-supplier')
router.register(r'admin-supplier-products', AdminSupplierProductViewSet, basename='admin-supplier-product')

urlpatterns = [
    path('', include(router.urls)),
]
