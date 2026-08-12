from django.urls import path
from .views import AdminDashboardMetricsView

urlpatterns = [
    path('dashboard/', AdminDashboardMetricsView.as_view(), name='admin_dashboard_metrics'),
]
