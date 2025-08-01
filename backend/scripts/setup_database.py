#!/usr/bin/env python
"""
Database setup script for Study Tracker
Run this after creating the Django project to set up initial data
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'study_tracker.settings')
django.setup()

from django.contrib.auth.models import User
from motivate.models import Quote

def create_sample_quotes():
    """Create sample motivational quotes"""
    quotes_data = [
        {
            'text': 'The expert in anything was once a beginner.',
            'author': 'Helen Hayes',
            'category': 'learning'
        },
        {
            'text': 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
            'author': 'Winston Churchill',
            'category': 'success'
        },
        {
            'text': 'The only way to do great work is to love what you do.',
            'author': 'Steve Jobs',
            'category': 'motivation'
        },
        {
            'text': 'Education is the most powerful weapon which you can use to change the world.',
            'author': 'Nelson Mandela',
            'category': 'learning'
        },
        {
            'text': 'The future belongs to those who believe in the beauty of their dreams.',
            'author': 'Eleanor Roosevelt',
            'category': 'motivation'
        },
        {
            'text': 'It does not matter how slowly you go as long as you do not stop.',
            'author': 'Confucius',
            'category': 'persistence'
        },
        {
            'text': 'The only impossible journey is the one you never begin.',
            'author': 'Tony Robbins',
            'category': 'motivation'
        },
        {
            'text': 'Learning never exhausts the mind.',
            'author': 'Leonardo da Vinci',
            'category': 'learning'
        },
        {
            'text': 'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.',
            'author': 'Brian Herbert',
            'category': 'learning'
        },
        {
            'text': 'Focus on being productive instead of busy.',
            'author': 'Tim Ferriss',
            'category': 'focus'
        },
        {
            'text': 'Growth begins at the end of your comfort zone.',
            'author': 'Unknown',
            'category': 'growth'
        },
        {
            'text': 'The difference between ordinary and extraordinary is that little extra.',
            'author': 'Jimmy Johnson',
            'category': 'success'
        },
        {
            'text': 'Discipline is the bridge between goals and accomplishment.',
            'author': 'Jim Rohn',
            'category': 'persistence'
        },
        {
            'text': 'The beautiful thing about learning is that no one can take it away from you.',
            'author': 'B.B. King',
            'category': 'learning'
        },
        {
            'text': 'Success is the sum of small efforts repeated day in and day out.',
            'author': 'Robert Collier',
            'category': 'success'
        }
    ]
    
    for quote_data in quotes_data:
        Quote.objects.get_or_create(
            text=quote_data['text'],
            defaults={
                'author': quote_data['author'],
                'category': quote_data['category'],
                'created_by_admin': True
            }
        )
    
    print(f"Created {len(quotes_data)} sample quotes")

def create_superuser():
    """Create a superuser if it doesn't exist"""
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@studytracker.com',
            password='admin123'
        )
        print("Created superuser: admin/admin123")
    else:
        print("Superuser already exists")

def main():
    """Run all setup functions"""
    print("Setting up Study Tracker database...")
    create_sample_quotes()
    create_superuser()
    print("Database setup complete!")

if __name__ == '__main__':
    main()
