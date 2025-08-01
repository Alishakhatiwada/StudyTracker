from rest_framework import serializers
from .models import StudyMilestone

class StudyMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyMilestone
        fields = ['id', 'title', 'achieved', 'created_at', 'achieved_at']
        read_only_fields = ['user', 'created_at', 'achieved_at']
