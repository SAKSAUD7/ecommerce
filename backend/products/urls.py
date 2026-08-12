from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, CollectionViewSet, ProductViewSet, AdminProductViewSet, AdminCategoryViewSet, BrandViewSet, AdminBrandViewSet, AdminCollectionViewSet, ReviewCreateView, WishlistView

router = DefaultRouter()
router.register(r'admin-items', AdminProductViewSet, basename='admin-product')
router.register(r'admin-categories', AdminCategoryViewSet, basename='admin-category')
router.register(r'admin-brands', AdminBrandViewSet, basename='admin-brand')
router.register(r'admin-collections', AdminCollectionViewSet, basename='admin-collection')
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'collections', CollectionViewSet, basename='collection')
router.register(r'items', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    path('items/<slug:product_slug>/reviews/', ReviewCreateView.as_view(), name='product_review_create'),
    path('wishlist/', WishlistView.as_view(), name='wishlist_detail'),
]
