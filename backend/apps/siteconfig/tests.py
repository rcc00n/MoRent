from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class SiteContactConfigAPIViewTests(APITestCase):
    @override_settings(
        BUSINESS_CONTACT_PHONE="+7 999 123 45 67",
        BUSINESS_CONTACT_EMAIL="hello@morent.example",
        BUSINESS_CONTACT_WHATSAPP_URL="https://wa.me/79991234567",
        BUSINESS_CONTACT_TELEGRAM_URL="https://t.me/morent",
    )
    def test_returns_business_contact_channels(self):
        response = self.client.get(reverse("site-contact-config"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["channels"]["phone"]["href"], "tel:+79991234567")
        self.assertEqual(
            response.data["channels"]["email"]["href"], "mailto:hello@morent.example"
        )
        self.assertEqual(
            response.data["channels"]["whatsapp"]["href"], "https://wa.me/79991234567"
        )
