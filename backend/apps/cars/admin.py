from django.contrib import admin
from django.utils.html import format_html

from .models import Car, CarGalleryImage


class CarGalleryImageInline(admin.TabularInline):
    model = CarGalleryImage
    extra = 0
    ordering = ("sort_order", "id")
    fields = (
        "sort_order",
        "is_visible",
        "image_file",
        "image_url",
        "alt_en",
        "alt_ru",
        "image_preview",
    )
    readonly_fields = ("image_preview",)

    @admin.display(description="Preview")
    def image_preview(self, obj: CarGalleryImage):
        if obj.image_file:
            return format_html(
                '<img class="morent-car-preview" src="{}" alt="" />',
                obj.image_file.url,
            )
        if obj.image_url:
            return format_html(
                '<img class="morent-car-preview" src="{}" alt="" />',
                obj.image_url,
            )
        return "No image"


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    empty_value_display = "Not provided"
    inlines = (CarGalleryImageInline,)
    list_display = (
        "id",
        "display_name",
        "price_per_day",
        "available",
        "is_featured",
        "is_visible",
        "display_order",
        "image_preview",
    )
    list_filter = ("available", "is_featured", "is_visible", "brand")
    search_fields = ("brand", "model", "title_en", "title_ru")
    ordering = ("display_order", "brand", "model")
    list_editable = ("available", "is_featured", "is_visible", "display_order")
    fieldsets = (
        (
            "Public identity",
            {
                "fields": (
                    ("brand", "model"),
                    ("title_en", "title_ru"),
                    ("price_per_day", "available"),
                    ("is_featured", "is_visible", "display_order"),
                )
            },
        ),
        (
            "Descriptions",
            {
                "fields": (
                    ("short_description_en", "short_description_ru"),
                    ("long_description_en", "long_description_ru"),
                    "description",
                )
            },
        ),
        (
            "Images",
            {
                "fields": (
                    ("image_file", "image"),
                    "image_preview",
                )
            },
        ),
    )
    readonly_fields = ("image_preview",)

    @admin.display(description="Car")
    def display_name(self, obj: Car):
        return obj.title_en or f"{obj.brand} {obj.model}"

    @admin.display(description="Preview")
    def image_preview(self, obj: Car):
        if obj.image_file:
            return format_html(
                '<a href="{}" target="_blank" rel="noreferrer">'
                '<img class="morent-car-preview" src="{}" alt="{}" />'
                "</a>",
                obj.image_file.url,
                obj.image_file.url,
                obj,
            )

        if not obj.image:
            return "No primary image"

        return format_html(
            '<a href="{}" target="_blank" rel="noreferrer">'
            '<img class="morent-car-preview" src="{}" alt="{}" />'
            "</a>",
            obj.image,
            obj.image,
            obj,
        )
