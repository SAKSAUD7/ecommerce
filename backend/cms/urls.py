from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HeroSliderViewSet, LookbookViewSet, BlogPostViewSet, AdminHeroSliderViewSet, AdminBlogPostViewSet, StoreSettingsView, PageViewSet, AdminPageViewSet, AdminPageSectionViewSet

router = DefaultRouter()
router.register(r'sliders', HeroSliderViewSet, basename='slider')
router.register(r'lookbooks', LookbookViewSet, basename='lookbook')
router.register(r'blogs', BlogPostViewSet, basename='blog')
router.register(r'pages', PageViewSet, basename='page')
router.register(r'admin-sliders', AdminHeroSliderViewSet, basename='admin-slider')
router.register(r'admin-blogs', AdminBlogPostViewSet, basename='admin-blog')
router.register(r'admin-pages', AdminPageViewSet, basename='admin-page')
router.register(r'admin-page-sections', AdminPageSectionViewSet, basename='admin-page-section')

urlpatterns = [
    path('settings/', StoreSettingsView.as_view(), name='store-settings'),
    path('', include(router.urls)),
]
