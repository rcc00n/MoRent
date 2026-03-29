from django.db import models

from apps.cars.models import Car


class Booking(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    car = models.ForeignKey(Car, on_delete=models.PROTECT, related_name="bookings")
    start_date = models.DateField()
    end_date = models.DateField()
    source = models.CharField(max_length=100, blank=True, default="website")
    source_context = models.JSONField(blank=True, default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} — {self.car}"
