from rest_framework import serializers
from .models import Quote, Reminder

class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ['id', 'text', 'author', 'created_by_admin']
        read_only_fields = ['created_by_admin'] # Admin can set this, but not directly by user API

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ['id', 'message', 'sent_at', 'user']
        read_only_fields = ['user', 'sent_at']
