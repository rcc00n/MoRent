from django.conf import settings

from .models import SiteSettings


def normalize_language(value: str | None) -> str:
    return "ru" if str(value or "").lower().startswith("ru") else "en"


def get_requested_language(request) -> str:
    return normalize_language(request.GET.get("lang"))


def build_phone_href(phone_number: str) -> str:
    normalized_number = "".join(
        character for character in str(phone_number or "")
        if character.isdigit() or character == "+"
    )
    return f"tel:{normalized_number}" if normalized_number else ""


def get_site_settings() -> SiteSettings:
    site_settings, _ = SiteSettings.objects.get_or_create(
        pk=1,
        defaults={
            "brand_name": "MoRent",
            "company_name": "MoRent",
            "phone": settings.BUSINESS_CONTACT_PHONE,
            "email": settings.BUSINESS_CONTACT_EMAIL,
            "whatsapp_url": settings.BUSINESS_CONTACT_WHATSAPP_URL,
            "telegram_url": settings.BUSINESS_CONTACT_TELEGRAM_URL,
            "working_hours_en": settings.BUSINESS_SERVICE_HOURS,
            "working_hours_ru": settings.BUSINESS_SERVICE_HOURS,
        },
    )
    return site_settings
