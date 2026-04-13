from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create default admin user'

    def handle(self, *args, **options):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@ubp.com',
                password='admin1234'
            )
            self.stdout.write(self.style.SUCCESS('Admin user created!'))
        else:
            self.stdout.write(self.style.SUCCESS('Admin already exists!'))