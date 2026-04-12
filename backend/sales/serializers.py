from rest_framework import serializers
from .models import Product, SalesRecord, Inventory

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class SalesRecordSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = SalesRecord
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(
        source='product.price', 
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )
    low_stock_threshold = serializers.IntegerField(
        source='product.low_stock_threshold', 
        read_only=True
    )
    
    class Meta:
        model = Inventory
        fields = '__all__'