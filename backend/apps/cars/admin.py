from django.contrib import admin

from .models import Car


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ("id", "brand", "model", "price_per_day", "available")
    list_filter = ("available", "brand")
    search_fields = ("brand", "model")
