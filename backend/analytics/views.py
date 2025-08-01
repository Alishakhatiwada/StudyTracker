import csv
from datetime import date, timedelta
from django.db.models import Sum
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from tracker.models import StudySession, Subject
from .models import StudyMilestone
from .serializers import StudyMilestoneSerializer

class DailyBreakdownAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        today = date.today()
        # Get sessions for the last 7 days
        start_date = today - timedelta(days=6)
        
        sessions = StudySession.objects.filter(
            user=user,
            date__gte=start_date,
            date__lte=today
        ).values('date').annotate(total_duration=Sum('duration')).order_by('date')

        daily_data = {
            (start_date + timedelta(days=i)).strftime('%A'): 0.0
            for i in range(7)
        }

        for session in sessions:
            day_name = session['date'].strftime('%A')
            daily_data[day_name] = float(session['total_duration'])

        return Response(daily_data)

class SubjectWiseWeeklyStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        today = date.today()
        start_of_week = today - timedelta(days=today.weekday()) # Monday as start of week

        sessions = StudySession.objects.filter(
            user=user,
            date__gte=start_of_week,
            date__lte=today
        ).values('subject__name').annotate(total_duration=Sum('duration')).order_by('subject__name')

        subject_stats = {
            session['subject__name']: float(session['total_duration'])
            for session in sessions
        }
        return Response(subject_stats)

class MonthlyReportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        today = date.today()
        start_of_month = today.replace(day=1)

        sessions = StudySession.objects.filter(
            user=user,
            date__gte=start_of_month,
            date__lte=today
        ).values('date').annotate(total_duration=Sum('duration')).order_by('date')

        monthly_data = {
            (start_of_month + timedelta(days=i)).day: 0.0
            for i in range((today - start_of_month).days + 1)
        }

        for session in sessions:
            day_number = session['date'].day
            monthly_data[day_number] = float(session['total_duration'])

        return Response(monthly_data)

class MilestoneTrackerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    # Define some example milestones (total hours)
    MILESTONES = {
        10: "First 10 hours!",
        50: "Half-century of study!",
        100: "Century of study hours!",
        250: "Quarter-millennium of study!",
        500: "Half-millennium of study!",
    }

    def get(self, request, *args, **kwargs):
        user = request.user
        total_study_hours = StudySession.objects.filter(user=user).aggregate(Sum('duration'))['duration__sum'] or 0

        achieved_milestones = []
        for hours, title in self.MILESTONES.items():
            if total_study_hours >= hours:
                milestone, created = StudyMilestone.objects.get_or_create(
                    user=user,
                    title=title,
                    defaults={'achieved': True, 'achieved_at': date.today()}
                )
                if not milestone.achieved: # Mark as achieved if it wasn't before
                    milestone.achieved = True
                    milestone.achieved_at = date.today()
                    milestone.save()
                achieved_milestones.append(StudyMilestoneSerializer(milestone).data)
            else:
                # If a milestone was previously achieved but total hours dropped (e.g., data deleted),
                # you might want to un-achieve it. For simplicity, we'll just not list it here.
                # Or, if you want to list all possible milestones and their status:
                try:
                    milestone = StudyMilestone.objects.get(user=user, title=title)
                    achieved_milestones.append(StudyMilestoneSerializer(milestone).data)
                except StudyMilestone.DoesNotExist:
                    # Not yet achieved and not in DB, so don't add
                    pass


        return Response({
            'total_study_hours': float(total_study_hours),
            'milestones': achieved_milestones,
            'next_milestone': self._get_next_milestone(total_study_hours)
        })

    def _get_next_milestone(self, current_hours):
        sorted_milestones = sorted(self.MILESTONES.items())
        for hours, title in sorted_milestones:
            if current_hours < hours:
                return {'target_hours': hours, 'title': title, 'hours_to_go': float(hours - current_hours)}
        return None # All milestones achieved

class ExportStudyDataCSVAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="study_data_{user.username}_{date.today()}.csv"'

        writer = csv.writer(response)
        writer.writerow(['Session ID', 'Subject', 'Date', 'Duration (hours)', 'Notes', 'Tags'])

        sessions = StudySession.objects.filter(user=user).select_related('subject').order_by('date')

        for session in sessions:
            writer.writerow([
                session.id,
                session.subject.name,
                session.date.strftime('%Y-%m-%d'),
                float(session.duration),
                session.notes if session.notes else '',
                session.tags if session.tags else ''
            ])
        return response
