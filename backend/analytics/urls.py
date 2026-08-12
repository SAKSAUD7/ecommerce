from django.urls import path
from .views import AdminDashboardMetricsView, AdminReportsAnalyticsView

urlpatterns = [
    path('dashboard/', AdminDashboardMetricsView.as_view(), name='admin_dashboard_metrics'),
    path('reports/', AdminReportsAnalyticsView.as_view(), name='admin_reports_analytics'),
]
