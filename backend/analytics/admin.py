from django.contrib import admin
from .models import StudyMilestone

@admin.register(StudyMilestone)
class StudyMilestoneAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'achieved', 'created_at', 'achieved_at')
    list_filter = ('achieved', 'created_at')
    search_fields = ('user__username', 'title')
    raw_id_fields = ('user',) # For better user selection in admin
