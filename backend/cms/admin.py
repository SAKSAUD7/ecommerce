from django.contrib import admin
from .models import HeroSlider, Lookbook, LookbookItem, BlogPost

@admin.register(HeroSlider)
class HeroSliderAdmin(admin.ModelAdmin):
    list_display = ['title', 'subtitle', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['title', 'subtitle']
    list_editable = ['order', 'is_active']

class LookbookItemInline(admin.TabularInline):
    model = LookbookItem
    extra = 1

@admin.register(Lookbook)
class LookbookAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [LookbookItemInline]

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'author_name', 'is_published', 'created_at']
    list_filter = ['is_published']
    search_fields = ['title', 'summary', 'content', 'author_name']
    prepopulated_fields = {'slug': ('title',)}
