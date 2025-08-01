from django.db import models
from django.contrib.auth.models import User

class StudyMilestone(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_milestones')
    title = models.CharField(max_length=255)
    achieved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    achieved_at = models.DateTimeField(blank=True, null=True) # When the milestone was achieved

    class Meta:
        unique_together = ('user', 'title') # Ensure unique milestone titles per user

    def __str__(self):
        return f"{self.user.username} - {self.title} (Achieved: {self.achieved})"
