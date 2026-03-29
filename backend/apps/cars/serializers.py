from rest_framework import serializers

from .models import Car, CarGalleryImage


def normalize_language(value: str | None) -> str:
    return "ru" if str(value or "").lower().startswith("ru") else "en"


def localized_value(instance, field_name: str, language: str, fallback: str = "") -> str:
    value = getattr(instance, f"{field_name}_{language}", "")
    if value:
        return value

    if language != "en":
        english_value = getattr(instance, f"{field_name}_en", "")
        if english_value:
            return english_value

    return fallback


class CarGalleryImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    alt = serializers.SerializerMethodField()

    class Meta:
        model = CarGalleryImage
        fields = ("image", "alt")

    def get_image(self, obj: CarGalleryImage) -> str:
        request = self.context.get("request")
        if obj.image_file:
            return request.build_absolute_uri(obj.image_file.url) if request else obj.image_file.url
        return obj.image_url

    def get_alt(self, obj: CarGalleryImage) -> str:
        language = normalize_language(self.context.get("language"))
        return localized_value(obj, "alt", language)


class CarSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    long_description = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()

    class Meta:
        model = Car
        fields = (
            "id",
            "brand",
            "model",
            "title",
            "price_per_day",
            "image",
            "primary_image",
            "description",
            "short_description",
            "long_description",
            "available",
            "is_featured",
            "is_visible",
            "display_order",
            "gallery",
        )

    def language(self) -> str:
        return normalize_language(self.context.get("language"))

    def resolve_image_url(self, obj: Car) -> str:
        request = self.context.get("request")
        if obj.image_file:
            return request.build_absolute_uri(obj.image_file.url) if request else obj.image_file.url
        return obj.image

    def get_title(self, obj: Car) -> str:
        language = self.language()
        return localized_value(obj, "title", language, fallback=f"{obj.brand} {obj.model}")

    def get_image(self, obj: Car) -> str:
        return self.resolve_image_url(obj)

    def get_primary_image(self, obj: Car) -> str:
        return self.resolve_image_url(obj)

    def get_short_description(self, obj: Car) -> str:
        language = self.language()
        return localized_value(obj, "short_description", language, fallback=obj.description)

    def get_long_description(self, obj: Car) -> str:
        language = self.language()
        return localized_value(
            obj,
            "long_description",
            language,
            fallback=self.get_short_description(obj),
        )

    def get_description(self, obj: Car) -> str:
        return self.get_long_description(obj)

    def get_gallery(self, obj: Car) -> list[str]:
        request = self.context.get("request")
        gallery_queryset = obj.gallery_images.filter(is_visible=True)
        if gallery_queryset.exists():
            serializer = CarGalleryImageSerializer(
                gallery_queryset,
                many=True,
                context={
                    "request": request,
                    "language": self.language(),
                },
            )
            return [item["image"] for item in serializer.data if item["image"]]

        primary_image = self.resolve_image_url(obj)
        return [primary_image] if primary_image else []
