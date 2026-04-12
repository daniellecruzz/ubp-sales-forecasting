from django.contrib import admin
from .models import Product, SalesRecord, Inventory

admin.site.register(Product)
admin.site.register(SalesRecord)
admin.site.register(Inventory)