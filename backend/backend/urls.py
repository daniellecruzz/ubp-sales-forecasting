from django.contrib import admin
from django.urls import path, include
from .auth_views import login_view, logout_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('sales.urls')),
    path('api/forecasting/', include('forecasting.urls')),
    path('api/auth/login/', login_view),
    path('api/auth/logout/', logout_view),
]