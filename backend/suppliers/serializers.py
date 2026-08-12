from rest_framework import serializers
from .models import Supplier, SupplierProduct
from products.serializers import ProductVariantSerializer

class SupplierProductSerializer(serializers.ModelSerializer):
    variant_details = ProductVariantSerializer(source='variant', read_only=True)
    
    class Meta:
        model = SupplierProduct
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Supplier
        fields = '__all__'
        
    def get_products_count(self, obj):
        return obj.products.count()

class SupplierDetailSerializer(serializers.ModelSerializer):
    products = SupplierProductSerializer(many=True, read_only=True)
    
    class Meta:
        model = Supplier
        fields = '__all__'
