from django.urls import path
from .views import (
    RandomMotivationalQuoteAPIView,
    QuoteOfTheDayAPIView,
    GoalReminderMessagesAPIView,
    AdminQuoteManagementViewSet,
    AdminQuoteDetailViewSet,
)

urlpatterns = [
    path('quote/random/', RandomMotivationalQuoteAPIView.as_view(), name='random-quote'),
    path('quote/daily/', QuoteOfTheDayAPIView.as_view(), name='quote-of-the-day'),
    path('reminders/', GoalReminderMessagesAPIView.as_view(), name='goal-reminders'),
    path('admin/quotes/', AdminQuoteManagementViewSet.as_view(), name='admin-quote-list-create'),
    path('admin/quotes/<int:pk>/', AdminQuoteDetailViewSet.as_view(), name='admin-quote-detail'),
]
