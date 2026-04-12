from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, SalesRecordViewSet, InventoryViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'sales', SalesRecordViewSet)
router.register(r'inventory', InventoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]