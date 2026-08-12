from rest_framework import serializers
from .models import HeroSlider, Lookbook, LookbookItem, BlogPost, StoreSettings, Page, PageSection
from products.serializers import ProductSerializer

class HeroSliderSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlider
        fields = '__all__'

class LookbookItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = LookbookItem
        fields = ('id', 'product', 'product_details', 'x_position', 'y_position')

class LookbookSerializer(serializers.ModelSerializer):
    items = LookbookItemSerializer(many=True, read_only=True)

    class Meta:
        model = Lookbook
        fields = ('id', 'title', 'slug', 'description', 'cover_image_url', 'is_active', 'items', 'created_at')

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'

class StoreSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreSettings
        fields = '__all__'

class PageSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageSection
        fields = '__all__'

class PageSerializer(serializers.ModelSerializer):
    sections = PageSectionSerializer(many=True, read_only=True)

    class Meta:
        model = Page
        fields = ('id', 'title', 'slug', 'is_published', 'meta_title', 'meta_description', 'sections', 'created_at', 'updated_at')
