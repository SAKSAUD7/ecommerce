from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Address

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'avatar', 'rewards_points', 'is_customer', 'is_seller', 'is_admin', 'is_staff', 'is_superuser', 'date_joined')
        read_only_fields = ('id', 'rewards_points', 'is_customer', 'is_seller', 'is_admin', 'is_staff', 'is_superuser', 'date_joined')

class AdminUserListSerializer(serializers.ModelSerializer):
    total_orders = serializers.SerializerMethodField()
    lifetime_spend = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'avatar', 'rewards_points', 'is_customer', 'date_joined', 'total_orders', 'lifetime_spend')

    def get_total_orders(self, obj):
        return obj.orders.count() if hasattr(obj, 'orders') else 0

    def get_lifetime_spend(self, obj):
        from django.db.models import Sum
        if hasattr(obj, 'orders'):
            total = obj.orders.filter(status='paid').aggregate(total_spent=Sum('total'))['total_spent']
            return total if total else 0.00
        return 0.00

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'phone')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            phone=validated_data.get('phone', ''),
            is_customer=True
        )
        return user

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ('user',)
