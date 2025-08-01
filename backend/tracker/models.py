from django.db import models
from django.contrib.auth.models import User

class Subject(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('user', 'name') # Ensure unique subject names per user

    def __str__(self):
        return f"{self.name} ({self.user.username})"

class StudySession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_sessions')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='sessions')
    date = models.DateField()
    duration = models.DecimalField(max_digits=5, decimal_places=2)  # in hours
    notes = models.TextField(blank=True, null=True)
    tags = models.CharField(max_length=255, blank=True, null=True) # NEW

    class Meta:
        ordering = ['-date', '-id'] # Order by most recent sessions

    def __str__(self):
        return f"{self.subject.name} - {self.date} ({self.duration} hours)"

class StudyGoal(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='study_goal')
    target_hours_per_week = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"Goal for {self.user.username}: {self.target_hours_per_week} hours/week"
