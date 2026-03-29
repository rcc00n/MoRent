from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "phone", "car", "start_date", "end_date", "created_at")
    list_filter = ("start_date", "end_date", "created_at")
    search_fields = ("name", "phone", "car__brand", "car__model")
