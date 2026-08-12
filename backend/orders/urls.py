from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartView, CouponValidateView, CheckoutView, OrderViewSet, AdminOrderViewSet, OrderTrackingView, AdminCouponViewSet

router = DefaultRouter()
router.register(r'admin-orders', AdminOrderViewSet, basename='admin_orders')
router.register(r'admin-coupons', AdminCouponViewSet, basename='admin_coupons')
router.register(r'history', OrderViewSet, basename='order_history')

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart_detail'),
    path('coupon/validate/', CouponValidateView.as_view(), name='coupon_validate'),
    path('checkout/', CheckoutView.as_view(), name='checkout_process'),
    path('track/', OrderTrackingView.as_view(), name='order_tracking'),
    path('', include(router.urls)),
]
