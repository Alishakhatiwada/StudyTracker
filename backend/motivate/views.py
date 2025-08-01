import random
from datetime import timedelta,date
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import generics, status
from .models import Quote, Reminder
from .serializers import QuoteSerializer, ReminderSerializer
from tracker.models import StudyGoal, StudySession
from django.db.models import Sum

class RandomMotivationalQuoteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        quotes = Quote.objects.all()
        if not quotes.exists():
            return Response({"message": "No quotes available."}, status=status.HTTP_404_NOT_FOUND)
        
        random_quote = random.choice(quotes)
        serializer = QuoteSerializer(random_quote)
        return Response(serializer.data)

class QuoteOfTheDayAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # For simplicity, let's pick a quote based on the day of the year
        # In a real app, you might have a more sophisticated system (e.g., daily cron job)
        today_day_of_year = date.today().timetuple().tm_yday
        quotes = Quote.objects.all()
        
        if not quotes.exists():
            return Response({"message": "No quotes available."}, status=status.HTTP_404_NOT_FOUND)
        
        # Use modulo to cycle through quotes based on day of year
        quote_index = (today_day_of_year - 1) % quotes.count()
        quote_of_the_day = quotes[quote_index]
        
        serializer = QuoteSerializer(quote_of_the_day)
        return Response(serializer.data)

class GoalReminderMessagesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        reminders = []

        # 1. Weekly Goal Reminder
        try:
            study_goal = StudyGoal.objects.get(user=user)
            today = date.today()
            start_of_week = today - timedelta(days=today.weekday())
            total_hours_this_week = StudySession.objects.filter(
                user=user,
                date__gte=start_of_week,
                date__lte=today
            ).aggregate(Sum('duration'))['duration__sum'] or 0

            if total_hours_this_week < study_goal.target_hours_per_week:
                hours_needed = study_goal.target_hours_per_week - total_hours_this_week
                reminders.append({
                    "type": "goal_progress",
                    "message": f"You've studied {total_hours_this_week:.1f} hours this week. You need {hours_needed:.1f} more hours to reach your goal of {study_goal.target_hours_per_week} hours!",
                    "goal_met": False
                })
            else:
                reminders.append({
                    "type": "goal_progress",
                    "message": f"Great job! You've already met your weekly goal of {study_goal.target_hours_per_week} hours with {total_hours_this_week:.1f} hours studied!",
                    "goal_met": True
                })
        except StudyGoal.DoesNotExist:
            reminders.append({
                "type": "goal_setup",
                "message": "You haven't set a weekly study goal yet. Set one to track your progress!",
                "goal_met": False
            })
        
        # 2. Performance-Based Encouragement (Example: if user studied a lot yesterday)
        yesterday = date.today() - timedelta(days=1)
        yesterday_hours = StudySession.objects.filter(
            user=user,
            date=yesterday
        ).aggregate(Sum('duration'))['duration__sum'] or 0

        if yesterday_hours >= 3: # Arbitrary threshold for "a lot"
            reminders.append({
                "type": "encouragement",
                "message": f"You studied for {yesterday_hours:.1f} hours yesterday! Keep up the fantastic work!",
            })
        elif yesterday_hours == 0:
             reminders.append({
                "type": "encouragement",
                "message": "No study sessions yesterday? It's okay, every day is a new chance to learn!",
            })

        # You can add more types of reminders here (e.g., milestone reminders from analytics)

        return Response(reminders)

class AdminQuoteManagementViewSet(generics.ListCreateAPIView):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [IsAdminUser] # Only admin users can add/list quotes

    def perform_create(self, serializer):
        serializer.save(created_by_admin=True)

class AdminQuoteDetailViewSet(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [IsAdminUser] # Only admin users can retrieve/update/delete quotes
