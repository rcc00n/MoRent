from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Car


class CarListAPIViewTests(APITestCase):
    def setUp(self):
        Car.objects.all().delete()
        self.featured_car = Car.objects.create(
            brand="BMW",
            model="X5 Test",
            price_per_day="180.00",
            image="https://example.com/bmw-x5.jpg",
            description="Legacy description.",
            short_description_en="Short english",
            short_description_ru="Короткое русское описание",
            long_description_en="Long english",
            long_description_ru="Длинное русское описание",
            available=True,
            is_featured=True,
            is_visible=True,
            display_order=10,
        )
        Car.objects.create(
            brand="Mercedes-Benz",
            model="Hidden Test",
            price_per_day="210.00",
            image="https://example.com/hidden.jpg",
            description="Hidden",
            available=True,
            is_featured=False,
            is_visible=False,
            display_order=20,
        )

    def test_list_returns_only_visible_cars(self):
        response = self.client.get(reverse("car-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.featured_car.id)

    def test_featured_filter_and_language_are_supported(self):
        response = self.client.get(reverse("car-list"), {"featured": "1", "lang": "ru"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["short_description"], "Короткое русское описание")
        self.assertEqual(response.data[0]["description"], "Длинное русское описание")
