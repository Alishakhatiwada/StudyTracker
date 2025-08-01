from django.urls import path
from .views import (
    DailyBreakdownAPIView,
    SubjectWiseWeeklyStatsAPIView,
    MonthlyReportAPIView,
    MilestoneTrackerAPIView,
    ExportStudyDataCSVAPIView, # Import the new view
)

urlpatterns = [
    path('daily/', DailyBreakdownAPIView.as_view(), name='daily-breakdown'),
    path('subjects/', SubjectWiseWeeklyStatsAPIView.as_view(), name='subject-wise-stats'),
    path('monthly/', MonthlyReportAPIView.as_view(), name='monthly-report'),
    path('milestone/', MilestoneTrackerAPIView.as_view(), name='milestone-tracker'),
    path('export/', ExportStudyDataCSVAPIView.as_view(), name='export-data'), # Add the new URL
]
