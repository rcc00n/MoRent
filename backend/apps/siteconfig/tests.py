from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import (
    FaqPageContent,
    FAQItem,
    LegalPageContent,
    LegalSection,
    SiteSettings,
)


class SiteConfigAPITests(APITestCase):
    def setUp(self):
        self.site_settings = SiteSettings.objects.get(pk=1)
        self.site_settings.phone = "+7 999 123 45 67"
        self.site_settings.email = "hello@morent.example"
        self.site_settings.whatsapp_url = "https://wa.me/79991234567"
        self.site_settings.telegram_url = "https://t.me/morent"
        self.site_settings.working_hours_en = "Daily, 08:00 to 22:00"
        self.site_settings.working_hours_ru = "Ежедневно, с 08:00 до 22:00"
        self.site_settings.contact_availability_text_en = "Online booking request"
        self.site_settings.contact_availability_text_ru = "Онлайн-заявка на бронирование"
        self.site_settings.pickup_location_text_en = "Resort and airport pickup by arrangement"
        self.site_settings.pickup_location_text_ru = (
            "Курорт и аэропорт по согласованию"
        )
        self.site_settings.save()

    def test_contact_endpoint_returns_business_contact_channels(self):
        response = self.client.get(reverse("site-contact-config"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["channels"]["phone"]["href"], "tel:+79991234567")
        self.assertEqual(
            response.data["channels"]["email"]["href"],
            "mailto:hello@morent.example",
        )
        self.assertEqual(
            response.data["channels"]["whatsapp"]["href"],
            "https://wa.me/79991234567",
        )
        self.assertEqual(response.data["service_hours"], "Daily, 08:00 to 22:00")

    def test_settings_endpoint_returns_localized_fields(self):
        response = self.client.get(
            reverse("site-settings"),
            {"lang": "ru"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["working_hours"], "Ежедневно, с 08:00 до 22:00")
        self.assertEqual(
            response.data["contact_availability_text"],
            "Онлайн-заявка на бронирование",
        )
        self.assertEqual(
            response.data["pickup_location_text"],
            "Курорт и аэропорт по согласованию",
        )

    def test_faq_endpoints_return_localized_page_and_items(self):
        faq_page = FaqPageContent.objects.get(pk=1)
        faq_page.title_en = "Questions before booking"
        faq_page.title_ru = "Вопросы до бронирования"
        faq_page.save()
        FAQItem.objects.update_or_create(
            faq_page=faq_page,
            anchor="pickup-details",
            defaults={
                "sort_order": 999,
                "question_en": "Where is pickup?",
                "question_ru": "Где проходит выдача?",
                "answer_en": "Pickup is confirmed after review.",
                "answer_ru": "Выдача подтверждается после проверки.",
                "is_visible": True,
            },
        )

        page_response = self.client.get(
            reverse("site-page-content", kwargs={"page_key": "faq"}),
            {"lang": "ru"},
        )
        items_response = self.client.get(reverse("site-faq-list"), {"lang": "ru"})

        self.assertEqual(page_response.status_code, status.HTTP_200_OK)
        self.assertEqual(page_response.data["title"], "Вопросы до бронирования")
        self.assertEqual(items_response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            any(item["id"] == "pickup-details" for item in items_response.data)
        )

    def test_legal_endpoint_returns_sections(self):
        legal_page = LegalPageContent.objects.get(page_key=LegalPageContent.PageKey.TERMS)
        LegalSection.objects.update_or_create(
            legal_page=legal_page,
            sort_order=999,
            defaults={
                "title_en": "Extra section",
                "title_ru": "Дополнительный раздел",
                "items_en": "One line\nTwo line",
                "items_ru": "Один пункт\nДва пункта",
                "is_visible": True,
            },
        )

        response = self.client.get(
            reverse("site-legal-page", kwargs={"page_key": "terms"}),
            {"lang": "ru"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["page_key"], "terms")
        self.assertTrue(
            any(section["title"] == "Дополнительный раздел" for section in response.data["sections"])
        )
