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
        self.assertEqual(booking.source, "car_page")
        self.assertEqual(booking.request_type, Booking.RequestType.BOOKING)
        self.assertEqual(booking.status, Booking.LeadStatus.NEW)
        self.assertEqual(booking.crm_sync_status, Booking.CrmSyncStatus.PENDING)
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


class ContactLeadCreateAPIViewTests(APITestCase):
    def test_create_contact_request_with_email_only(self):
        response = self.client.post(
            reverse("contact-request-create"),
            {
                "name": "Marina Guest",
                "email": "guest@example.com",
                "message": "Need help choosing the right car for a resort transfer.",
                "request_type": "contact_request",
                "preferred_contact_method": "email",
                "source": "contacts-page",
                "source_context": {
                    "entry_point": "contact-form",
                    "locale": "en",
                },
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        lead = Booking.objects.get()
        self.assertEqual(lead.request_type, Booking.RequestType.CONTACT)
        self.assertEqual(lead.email, "guest@example.com")
        self.assertEqual(lead.phone, "")
        self.assertIsNone(lead.car)
        self.assertEqual(lead.source, "contacts_page")

    def test_create_support_request_requires_contact_channel(self):
        response = self.client.post(
            reverse("contact-request-create"),
            {
                "name": "Marina Guest",
                "message": "Need help with an existing enquiry.",
                "request_type": "support_request",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("phone", response.data)
        self.assertIn("email", response.data)
