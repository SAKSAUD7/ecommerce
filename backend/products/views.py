from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Avg

from .models import Category, Collection, Product, ProductVariant, Review, Wishlist, Brand
from .serializers import (
    CategorySerializer, CollectionSerializer, ProductSerializer, 
    AdminProductWriteSerializer, ReviewSerializer, WishlistSerializer, BrandSerializer
)

class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    permission_classes = [permissions.IsAdminUser]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AdminProductWriteSerializer
        return ProductSerializer

class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    lookup_field = 'slug'

class AdminBrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all().order_by('-id')
    serializer_class = BrandSerializer
    permission_classes = [permissions.IsAdminUser]

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('-id')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

class CollectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Collection.objects.filter(is_active=True)
    serializer_class = CollectionSerializer
    lookup_field = 'slug'

class AdminCollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all().order_by('-id')
    serializer_class = CollectionSerializer
    permission_classes = [permissions.IsAdminUser]

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['base_price', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Category Filter (include subcategories)
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            category = get_object_or_404(Category, slug=category_slug)
            # Find subcategories if any
            subcategories = category.subcategories.all()
            category_ids = [category.id] + [sub.id for sub in subcategories]
            queryset = queryset.filter(category_id__in=category_ids)

        # Collection Filter
        collection_slug = self.request.query_params.get('collection', None)
        if collection_slug:
            queryset = queryset.filter(collections__slug=collection_slug)

        # Price Range Filter
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        if min_price:
            queryset = queryset.filter(base_price__gte=min_price)
        if max_price:
            queryset = queryset.filter(base_price__lte=max_price)

        # Sizes & Colors Filters
        size = self.request.query_params.get('size', None)
        color = self.request.query_params.get('color', None)
        if size:
            queryset = queryset.filter(variants__size__iexact=size).distinct()
        if color:
            queryset = queryset.filter(variants__color__iexact=color).distinct()

        return queryset

class ReviewCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, product_slug):
        product = get_object_or_404(Product, slug=product_slug)
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            # Check if review already exists for this user on this product
            if Review.objects.filter(product=product, user=request.user).exists():
                return Response({"detail": "You have already reviewed this product."}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save(user=request.user, product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WishlistView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({"detail": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        product = get_object_or_404(Product, id=product_id)
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        
        if wishlist.products.filter(id=product.id).exists():
            wishlist.products.remove(product)
            action = "removed"
        else:
            wishlist.products.add(product)
            action = "added"
            
        return Response({
            "status": action,
            "product_id": product.id
        }, status=status.HTTP_200_OK)
