from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from apps.cars.models import Car

from .models import Booking


class AdminExperienceTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="admin-pass-123",
        )
        self.client.force_login(self.user)
        self.car = Car.objects.create(
            brand="BMW",
            model="X5 Admin",
            price_per_day="210.00",
            image="https://example.com/bmw-x5-admin.jpg",
            description="Premium SUV for admin verification.",
            available=True,
        )
        Booking.objects.create(
            name="Admin Lead",
            phone="+7 999 111 22 33",
            car=self.car,
            start_date="2026-04-05",
            end_date="2026-04-08",
            source="car_page",
            source_context={"entry_point": "booking_form"},
        )

    def test_custom_admin_index_loads_dashboard(self):
        response = self.client.get(reverse("admin:index"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "MoRent Control Room")
        self.assertContains(response, "Welcome back, admin.")
        self.assertContains(response, "Operations snapshot")
        self.assertContains(response, "Priority areas")
        self.assertContains(response, "Latest requests")

    def test_booking_change_list_exposes_lead_columns(self):
        response = self.client.get(reverse("admin:bookings_booking_changelist"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "CRM")
        self.assertContains(response, "Rental window")
        self.assertContains(response, "car_page")

    def test_admin_login_uses_custom_branding(self):
        self.client.logout()

        response = self.client.get(reverse("admin:login"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "MoRent Control Room")
        self.assertContains(response, "Premium control panel for leads, fleet, and site content.")
        self.assertContains(response, "Secure operator access for bookings, fleet, and content.")
        self.assertContains(response, "/static/morent_admin/css/theme.css")
