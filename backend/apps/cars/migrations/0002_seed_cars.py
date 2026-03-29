from django.db import migrations


def seed_cars(apps, schema_editor):
    Car = apps.get_model("cars", "Car")
    sample_cars = [
        {
            "brand": "BMW",
            "model": "X5",
            "price_per_day": "180.00",
            "image": "https://placehold.co/960x540/0b5cff/ffffff?text=BMW+X5",
            "description": "Premium SUV for business trips, city driving, and long-distance comfort.",
            "available": True,
        },
        {
            "brand": "Mercedes-Benz",
            "model": "E-Class",
            "price_per_day": "210.00",
            "image": "https://placehold.co/960x540/0b5cff/ffffff?text=Mercedes+E-Class",
            "description": "Executive sedan with a smooth ride, refined interior, and strong road presence.",
            "available": True,
        },
        {
            "brand": "Porsche",
            "model": "Cayenne",
            "price_per_day": "260.00",
            "image": "https://placehold.co/960x540/0b5cff/ffffff?text=Porsche+Cayenne",
            "description": "Luxury performance SUV for customers who want comfort and dynamic handling.",
            "available": True,
        },
    ]

    for car in sample_cars:
        Car.objects.update_or_create(
            brand=car["brand"],
            model=car["model"],
            defaults=car,
        )


def unseed_cars(apps, schema_editor):
    Car = apps.get_model("cars", "Car")
    Car.objects.filter(
        brand__in=["BMW", "Mercedes-Benz", "Porsche"],
        model__in=["X5", "E-Class", "Cayenne"],
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("cars", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_cars, unseed_cars),
    ]
