#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
python manage.py migrate
python manage.py shell -c "
from django.contrib.auth.models import User
if User.objects.filter(username='admin').exists():
    u = User.objects.get(username='admin')
    u.set_password('admin1234')
    u.is_staff = True
    u.is_superuser = True
    u.save()
    print('Admin password reset!')
else:
    User.objects.create_superuser('admin', 'admin@ubp.com', 'admin1234')
    print('Admin created!')
"
python manage.py collectstatic --no-input