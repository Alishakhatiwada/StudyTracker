from django.contrib import admin
from .models import Subject, StudySession, StudyGoal

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'description')
    list_filter = ('user',)
    search_fields = ('name', 'user__username')
    raw_id_fields = ('user',)

@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    list_display = ('subject', 'user', 'date', 'duration', 'tags')
    list_filter = ('date', 'subject', 'user')
    search_fields = ('subject__name', 'user__username', 'notes', 'tags')
    date_hierarchy = 'date'
    raw_id_fields = ('user', 'subject')

@admin.register(StudyGoal)
class StudyGoalAdmin(admin.ModelAdmin):
    list_display = ('user', 'target_hours_per_week')
    search_fields = ('user__username',)
    raw_id_fields = ('user',)
