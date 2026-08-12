from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import HeroSlider, Lookbook, BlogPost
from .serializers import HeroSliderSerializer, LookbookSerializer, BlogPostSerializer

class HeroSliderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HeroSlider.objects.filter(is_active=True)
    serializer_class = HeroSliderSerializer

class LookbookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lookbook.objects.filter(is_active=True)
    serializer_class = LookbookSerializer
    lookup_field = 'slug'

class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(is_published=True)
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'

class AdminHeroSliderViewSet(viewsets.ModelViewSet):
    queryset = HeroSlider.objects.all()
    serializer_class = HeroSliderSerializer
    permission_classes = [permissions.AllowAny]

class AdminBlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """
        Expects a list of objects: [{"id": 1, "order": 0}, {"id": 2, "order": 1}]
        """
        items = request.data
        if not isinstance(items, list):
            return Response({"error": "Expected a list of objects"}, status=400)
            
        for item in items:
            slider_id = item.get('id')
            order = item.get('order')
            if slider_id is not None and order is not None:
                HeroSlider.objects.filter(id=slider_id).update(order=order)
                
        return Response({"status": "reordered"})

from rest_framework import views, status
from .models import StoreSettings
from .serializers import StoreSettingsSerializer

class StoreSettingsView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        settings = StoreSettings.load()
        serializer = StoreSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        settings = StoreSettings.load()
        serializer = StoreSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from .models import Page, PageSection
from .serializers import PageSerializer, PageSectionSerializer

class PageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Page.objects.filter(is_published=True)
    serializer_class = PageSerializer
    lookup_field = 'slug'

class AdminPageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [IsAdminUser]

class AdminPageSectionViewSet(viewsets.ModelViewSet):
    queryset = PageSection.objects.all()
    serializer_class = PageSectionSerializer
    permission_classes = [IsAdminUser]
