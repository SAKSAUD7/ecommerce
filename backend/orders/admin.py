from django.contrib import admin
from .models import Coupon, Cart, CartItem, Order, OrderItem, Payment

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'value', 'active', 'valid_from', 'valid_to', 'used_count', 'max_uses']
    list_filter = ['active', 'discount_type']
    search_fields = ['code']

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['variant', 'quantity', 'created_at']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_key', 'created_at']
    search_fields = ['user__username', 'session_key']
    inlines = [CartItemInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['variant', 'price', 'quantity']

class PaymentInline(admin.StackedInline):
    model = Payment
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'email', 'status', 'total', 'created_at']
    list_filter = ['status']
    search_fields = ['full_name', 'email', 'phone', 'id']
    inlines = [OrderItemInline, PaymentInline]
    readonly_fields = ['subtotal', 'tax', 'shipping_cost', 'discount', 'total', 'created_at', 'updated_at']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['order', 'gateway', 'amount', 'status', 'created_at']
    list_filter = ['status', 'gateway']
    search_fields = ['order__id', 'transaction_id']
