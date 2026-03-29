from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.cars.models import Car
from .models import Booking


class BookingCreateAPIViewTests(APITestCase):
    def setUp(self):
        self.car = Car.objects.create(
            brand="BMW",
            model="X5 Test",
            price_per_day="180.00",
            image="https://example.com/bmw-x5.jpg",
            description="Premium SUV for testing request creation.",
            available=True,
        )

    def test_create_booking_accepts_source_metadata(self):
        response = self.client.post(
            reverse("booking-create"),
            {
                "name": "Alex Driver",
                "phone": "+7 999 123 45 67",
                "car": self.car.id,
                "start_date": "2026-04-01",
                "end_date": "2026-04-03",
                "source": "car-page",
                "source_context": {
                    "entry_point": "booking-form",
                    "page_path": f"/car/{self.car.id}",
                },
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        booking = Booking.objects.get()
        self.assertEqual(booking.source, "car-page")
        self.assertEqual(
            booking.source_context,
            {
                "entry_point": "booking-form",
                "page_path": f"/car/{self.car.id}",
            },
        )

    def test_create_booking_defaults_source_fields(self):
        response = self.client.post(
            reverse("booking-create"),
            {
                "name": "Alex Driver",
                "phone": "+7 999 123 45 67",
                "car": self.car.id,
                "start_date": "2026-04-01",
                "end_date": "2026-04-03",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        booking = Booking.objects.get()
        self.assertEqual(booking.source, "website")
        self.assertEqual(booking.source_context, {})
