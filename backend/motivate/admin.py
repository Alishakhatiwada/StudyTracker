from django.contrib import admin
from .models import Quote, Reminder

@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ('text', 'author', 'created_by_admin')
    list_filter = ('created_by_admin',)
    search_fields = ('text', 'author')

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'sent_at')
    list_filter = ('sent_at',)
    search_fields = ('user__username', 'message')
    raw_id_fields = ('user',)
