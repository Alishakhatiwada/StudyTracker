from django.db import models
from django.contrib.auth.models import User

class Quote(models.Model):
    text = models.TextField()
    author = models.CharField(max_length=255, blank=True, null=True)
    created_by_admin = models.BooleanField(default=True) # Indicates if added by admin or user

    def __str__(self):
        return f'"{self.text[:50]}..." - {self.author or "Unknown"}'

class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reminders')
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    # You might add fields like 'scheduled_at', 'is_sent', 'type' (e.g., 'goal_reminder', 'performance_encouragement')

    def __str__(self):
        return f"Reminder for {self.user.username}: {self.message[:50]}..."
