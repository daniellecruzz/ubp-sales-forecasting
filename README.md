# UBP Sales Forecasting System
A web-based management system for Ultimate Burger and Pizza with Sales Forecasting.

## Tech Stack
- **Frontend:** React + Tailwind CSS
- **Backend:** Django + Django REST Framework
- **Database:** SQLite
- **Forecasting:** Prophet, ETS, SARIMA

## Setup Instructions

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install django djangorestframework django-cors-headers statsmodels prophet scikit-learn pandas numpy
python3 manage.py migrate
python3 manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Access
- Frontend: http://localhost:5173
- Backend API: http://127.0.0.1:8000/api
- Admin: http://127.0.0.1:8000/admin
