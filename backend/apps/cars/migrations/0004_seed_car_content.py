from django.db import migrations


CAR_COPY = {
    ("BMW", "X5"): {
        "display_order": 10,
        "is_featured": True,
        "short_description_en": (
            "Premium SUV for business trips, city driving, and long-distance comfort."
        ),
        "short_description_ru": (
            "Премиальный SUV для деловых поездок, города и комфортных дальних маршрутов."
        ),
    },
    ("Mercedes-Benz", "E-Class"): {
        "display_order": 20,
        "is_featured": True,
        "short_description_en": (
            "Executive sedan with a smooth ride, refined interior, and strong road presence."
        ),
        "short_description_ru": (
            "Представительский седан с мягким ходом, премиальным салоном и уверенной подачей."
        ),
    },
    ("Porsche", "Cayenne"): {
        "display_order": 30,
        "is_featured": True,
        "short_description_en": (
            "Luxury performance SUV for customers who want comfort and dynamic handling."
        ),
        "short_description_ru": (
            "Премиальный спортивный SUV для тех, кто хочет комфорт и динамику в одной машине."
        ),
    },
}


def seed_car_content(apps, schema_editor):
    Car = apps.get_model("cars", "Car")

    for (brand, model), defaults in CAR_COPY.items():
        car = Car.objects.filter(brand=brand, model=model).first()
        if not car:
            continue

        for field_name, value in defaults.items():
            setattr(car, field_name, value)

        if not car.long_description_en:
            car.long_description_en = car.description
        if not car.long_description_ru:
            car.long_description_ru = defaults["short_description_ru"]
        if not car.short_description_en:
            car.short_description_en = defaults["short_description_en"]
        if not car.short_description_ru:
            car.short_description_ru = defaults["short_description_ru"]
        if not car.display_order:
            car.display_order = defaults["display_order"]
        if car.is_visible is None:
            car.is_visible = True

        car.save()


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("cars", "0003_alter_car_options_car_display_order_car_image_file_and_more"),
    ]

    operations = [
        migrations.RunPython(seed_car_content, noop),
    ]
