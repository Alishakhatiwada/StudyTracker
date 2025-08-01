from rest_framework import serializers
from .models import Subject, StudySession, StudyGoal

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'description', 'user']
        read_only_fields = ['user']

class StudySessionSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = StudySession
        fields = ['id', 'subject', 'subject_name', 'date', 'duration', 'notes', 'tags', 'user']
        read_only_fields = ['user']

class StudyGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyGoal
        fields = ['id', 'target_hours_per_week', 'user']
        read_only_fields = ['user']
