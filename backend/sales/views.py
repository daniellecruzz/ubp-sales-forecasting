from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db.models import Sum
from .models import Product, SalesRecord, Inventory
from .serializers import ProductSerializer, SalesRecordSerializer, InventorySerializer
from datetime import datetime, timedelta

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class SalesRecordViewSet(viewsets.ModelViewSet):
    queryset = SalesRecord.objects.all().order_by('-date')
    serializer_class = SalesRecordSerializer

    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        try:
            inventory = Inventory.objects.get(product=product)
            if inventory.quantity < quantity:
                raise ValidationError({'error': 'Not enough stock available!'})
        except Inventory.DoesNotExist:
            pass
        sale = serializer.save()
        try:
            inventory = Inventory.objects.get(product=sale.product)
            inventory.quantity -= sale.quantity
            inventory.save()
        except Inventory.DoesNotExist:
            pass

    def perform_destroy(self, instance):
        try:
            inventory = Inventory.objects.get(product=instance.product)
            inventory.quantity += instance.quantity
            inventory.save()
        except Inventory.DoesNotExist:
            pass
        instance.delete()

    @action(detail=False, methods=['get'])
    def summary(self, request):
        today = datetime.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)

        total_sales = SalesRecord.objects.aggregate(
            total=Sum('total_amount'))['total'] or 0
        weekly_sales = SalesRecord.objects.filter(
            date__gte=week_ago).aggregate(
            total=Sum('total_amount'))['total'] or 0
        monthly_sales = SalesRecord.objects.filter(
            date__gte=month_ago).aggregate(
            total=Sum('total_amount'))['total'] or 0

        weekly_data = SalesRecord.objects.filter(
            date__gte=week_ago
        ).values('date').annotate(
            total=Sum('total_amount')
        ).order_by('date')

        monthly_data = SalesRecord.objects.filter(
            date__gte=month_ago
        ).values('date').annotate(
            total=Sum('total_amount')
        ).order_by('date')

        return Response({
            'total_sales': total_sales,
            'weekly_sales': weekly_sales,
            'monthly_sales': monthly_sales,
            'weekly_data': list(weekly_data),
            'monthly_data': list(monthly_data),
        })

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer