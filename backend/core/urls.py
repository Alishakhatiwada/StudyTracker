from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')), # User authentication and registration
    path('tracker/', include('tracker.urls')), # Core study features
    path('analytics/', include('analytics.urls')), # Smart stats
    path('motivate/', include('motivate.urls')), # Motivation system
]
