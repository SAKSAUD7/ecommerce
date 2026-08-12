from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_customer', 'is_staff', 'rewards_points']
    list_filter = ['is_staff', 'is_active', 'is_customer', 'is_seller']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone', 'avatar')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_customer', 'is_seller', 'is_admin', 'groups', 'user_permissions'),
        }),
        ('Extra Data', {'fields': ('rewards_points',)}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'city', 'country', 'is_default_shipping', 'is_default_billing']
    list_filter = ['country', 'is_default_shipping', 'is_default_billing']
    search_fields = ['full_name', 'street_address', 'city', 'user__username', 'user__email']
