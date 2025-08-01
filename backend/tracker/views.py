from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Subject, StudySession, StudyGoal
from .serializers import SubjectSerializer, StudySessionSerializer, StudyGoalSerializer
from django.db.models import Sum
from datetime import date, timedelta

class SubjectViewSet(viewsets.ModelViewSet):
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subject.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class StudySessionViewSet(viewsets.ModelViewSet):
    serializer_class = StudySessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudySession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class StudyGoalViewSet(viewsets.ModelViewSet):
    serializer_class = StudyGoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # StudyGoal is OneToOne, so filter by user directly
        return StudyGoal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Ensure only one goal per user
        if StudyGoal.objects.filter(user=self.request.user).exists():
            return Response(
                {"detail": "A study goal already exists for this user. Please update it instead."},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='progress-summary')
    def progress_summary(self, request):
        """
        Provides a summary of study progress for the current week against the goal.
        """
        user = request.user
        today = date.today()
        start_of_week = today - timedelta(days=today.weekday()) # Monday as start of week

        weekly_sessions = StudySession.objects.filter(
            user=user,
            date__gte=start_of_week,
            date__lte=today
        )
        total_hours_this_week = weekly_sessions.aggregate(Sum('duration'))['duration__sum'] or 0

        try:
            study_goal = StudyGoal.objects.get(user=user)
            target_hours = study_goal.target_hours_per_week
        except StudyGoal.DoesNotExist:
            target_hours = 0 # No goal set

        return Response({
            'total_hours_this_week': total_hours_this_week,
            'target_hours_per_week': target_hours,
            'progress_percentage': (total_hours_this_week / target_hours * 100) if target_hours > 0 else 0,
            'hours_remaining': max(0, target_hours - total_hours_this_week)
        })
