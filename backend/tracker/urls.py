from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubjectViewSet, StudySessionViewSet, StudyGoalViewSet

router = DefaultRouter()
router.register(r'subjects', SubjectViewSet, basename='subject')
router.register(r'sessions', StudySessionViewSet, basename='session')
router.register(r'goals', StudyGoalViewSet, basename='goal')

urlpatterns = [
    path('', include(router.urls)),
]
