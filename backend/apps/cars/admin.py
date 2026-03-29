from django.contrib import admin
from django.utils.html import format_html

from .models import Car


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    empty_value_display = "Not provided"
    list_display = (
        "id",
        "brand",
        "model",
        "price_per_day",
        "available",
        "image_preview",
    )
    list_filter = ("available", "brand")
    search_fields = ("brand", "model")
    ordering = ("brand", "model")
    list_editable = ("available",)
    fieldsets = (
        (
            "Vehicle details",
            {
                "fields": (
                    ("brand", "model"),
                    ("price_per_day", "available"),
                )
            },
        ),
        (
            "Media and description",
            {
                "fields": (
                    "image",
                    "image_preview",
                    "description",
                )
            },
        ),
    )
    readonly_fields = ("image_preview",)

    @admin.display(description="Preview")
    def image_preview(self, obj: Car):
        if not obj.image:
            return "No image URL"

        return format_html(
            "<a href=\"{}\" target=\"_blank\" rel=\"noreferrer\">"
            "<img class=\"morent-car-preview\" src=\"{}\" alt=\"{}\" />"
            "</a>",
            obj.image,
            obj.image,
            obj,
        )
