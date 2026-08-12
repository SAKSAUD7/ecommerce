from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Collection, Product, ProductVariant, ProductImage, Review, Wishlist, Brand

User = get_user_model()

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image_url', 'is_featured', 'order', 'variant')

class ProductVariantSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = ProductVariant
        fields = ('id', 'name', 'sku', 'price_override', 'price', 'stock', 'size', 'color', 'color_hex', 'material', 'is_active')

class ReviewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'avatar')

class ReviewSerializer(serializers.ModelSerializer):
    user = ReviewUserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'product', 'user', 'rating', 'title', 'comment', 'verified_purchase', 'created_at')
        read_only_fields = ('id', 'user', 'verified_purchase', 'created_at')

class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    collections = CollectionSerializer(many=True, read_only=True)
    rating_average = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('id', 'name', 'slug', 'description', 'base_price', 'brand', 'category', 'collections', 'is_active', 'created_at', 'updated_at', 'variants', 'images', 'rating_average', 'reviews_count')

    def get_rating_average(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 0.0
        total = sum(r.rating for r in reviews)
        return round(total / len(reviews), 2)

    def get_reviews_count(self, obj):
        return obj.reviews.count()

class AdminProductWriteSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    brand_id = serializers.PrimaryKeyRelatedField(
        queryset=Brand.objects.all(), source='brand', write_only=True, required=False, allow_null=True
    )
    collection_ids = serializers.PrimaryKeyRelatedField(
        queryset=Collection.objects.all(), source='collections', write_only=True, many=True, required=False
    )

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'base_price', 'category_id', 'brand_id', 'collection_ids', 'is_active')


class WishlistSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ('id', 'products', 'created_at')
