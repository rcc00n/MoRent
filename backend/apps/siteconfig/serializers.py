from rest_framework import serializers

from .models import (
    AboutPageContent,
    ContactsPageContent,
    FaqPageContent,
    HomePageContent,
    HowItWorksPageContent,
    LegalPageContent,
    SiteSettings,
    ThankYouPageContent,
)
from .utils import build_phone_href


CHANNEL_LABELS = {
    "en": {
        "phone": "Phone",
        "email": "Email",
        "whatsapp": "WhatsApp",
        "telegram": "Telegram",
        "instagram": "Instagram",
        "facebook": "Facebook",
    },
    "ru": {
        "phone": "Телефон",
        "email": "Email",
        "whatsapp": "WhatsApp",
        "telegram": "Telegram",
        "instagram": "Instagram",
        "facebook": "Facebook",
    },
}


def localized_value(instance, field_name: str, language: str, fallback: str = "") -> str:
    value = getattr(instance, f"{field_name}_{language}", "")
    if value:
        return value

    if language != "en":
        english_value = getattr(instance, f"{field_name}_en", "")
        if english_value:
            return english_value

    return fallback


def split_bullets(value: str) -> list[str]:
    return [item.strip() for item in str(value or "").splitlines() if item.strip()]


class LocalizedSerializer(serializers.Serializer):
    @property
    def language(self) -> str:
        return self.context.get("language", "en")

    def image_url(self, instance, file_field_name: str, url_field_name: str) -> str:
        uploaded_file = getattr(instance, file_field_name, None)
        if uploaded_file:
            request = self.context.get("request")
            file_url = uploaded_file.url
            return request.build_absolute_uri(file_url) if request else file_url

        return getattr(instance, url_field_name, "") or ""

    def serialize_visuals(self, instance) -> dict:
        return {
            "primary_image": self.image_url(instance, "primary_image_file", "primary_image_url"),
            "primary_alt": localized_value(instance, "primary_image_alt", self.language),
            "primary_caption": localized_value(instance, "primary_image_caption", self.language),
            "secondary_image": self.image_url(
                instance,
                "secondary_image_file",
                "secondary_image_url",
            ),
            "secondary_alt": localized_value(instance, "secondary_image_alt", self.language),
            "secondary_caption": localized_value(
                instance,
                "secondary_image_caption",
                self.language,
            ),
        }

    def serialize_seo(self, instance, title_field: str, description_field: str) -> dict:
        return {
            "title": localized_value(
                instance,
                "seo_title",
                self.language,
                fallback=localized_value(instance, title_field, self.language),
            ),
            "description": localized_value(
                instance,
                "seo_description",
                self.language,
                fallback=localized_value(instance, description_field, self.language),
            ),
        }


class SiteSettingsSerializer(LocalizedSerializer):
    def to_representation(self, instance: SiteSettings):
        labels = CHANNEL_LABELS[self.language]
        return {
            "brand_name": instance.brand_name,
            "company_name": instance.company_name,
            "channels": {
                "phone": {
                    "label": labels["phone"],
                    "value": instance.phone,
                    "href": build_phone_href(instance.phone),
                },
                "email": {
                    "label": labels["email"],
                    "value": instance.email,
                    "href": f"mailto:{instance.email}" if instance.email else "",
                },
                "whatsapp": {
                    "label": labels["whatsapp"],
                    "value": labels["whatsapp"] if instance.whatsapp_url else "",
                    "href": instance.whatsapp_url,
                },
                "telegram": {
                    "label": labels["telegram"],
                    "value": labels["telegram"] if instance.telegram_url else "",
                    "href": instance.telegram_url,
                },
            },
            "social_links": [
                {
                    "key": "instagram",
                    "label": labels["instagram"],
                    "href": instance.instagram_url,
                },
                {
                    "key": "facebook",
                    "label": labels["facebook"],
                    "href": instance.facebook_url,
                },
                {
                    "key": "whatsapp",
                    "label": labels["whatsapp"],
                    "href": instance.whatsapp_url,
                },
                {
                    "key": "telegram",
                    "label": labels["telegram"],
                    "href": instance.telegram_url,
                },
            ],
            "working_hours": localized_value(instance, "working_hours", self.language),
            "service_hours": localized_value(instance, "working_hours", self.language),
            "contact_availability_text": localized_value(
                instance,
                "contact_availability_text",
                self.language,
            ),
            "pickup_location_text": localized_value(
                instance,
                "pickup_location_text",
                self.language,
            ),
            "footer": {
                "title": localized_value(instance, "footer_title", self.language),
                "text": localized_value(instance, "footer_text", self.language),
            },
            "cta_labels": {
                "primary": localized_value(instance, "primary_cta_label", self.language),
                "availability": localized_value(
                    instance,
                    "availability_cta_label",
                    self.language,
                ),
                "contact": localized_value(instance, "contact_cta_label", self.language),
                "consultation": localized_value(
                    instance,
                    "consultation_label",
                    self.language,
                ),
                "support": localized_value(instance, "support_label", self.language),
                "footer_request": localized_value(
                    instance,
                    "footer_request_label",
                    self.language,
                ),
                "footer_service": localized_value(
                    instance,
                    "footer_service_label",
                    self.language,
                ),
            },
            "seo": {
                "default_title": localized_value(
                    instance,
                    "seo_default_title",
                    self.language,
                ),
                "default_description": localized_value(
                    instance,
                    "seo_default_description",
                    self.language,
                ),
                "organization_description": localized_value(
                    instance,
                    "seo_organization_description",
                    self.language,
                ),
            },
        }


class HomePageContentSerializer(LocalizedSerializer):
    def to_representation(self, instance: HomePageContent):
        request = self.context.get("request")
        background_file = instance.hero_background_image_file
        background_image = ""

        if background_file:
            background_image = (
                request.build_absolute_uri(background_file.url)
                if request
                else background_file.url
            )
        elif instance.hero_background_image_url:
            background_image = instance.hero_background_image_url

        return {
            "hero": {
                "title": localized_value(instance, "hero_title", self.language),
                "description": localized_value(
                    instance,
                    "hero_description",
                    self.language,
                ),
                "background_image": background_image,
            },
            "signal": {
                "title": localized_value(instance, "signal_title", self.language),
            },
            "featured": {
                "title": localized_value(instance, "featured_title", self.language),
                "description": localized_value(
                    instance,
                    "featured_description",
                    self.language,
                ),
                "more_options": localized_value(
                    instance,
                    "featured_more_options",
                    self.language,
                ),
            },
            "destination": {
                "title": localized_value(instance, "destination_title", self.language),
                "description": localized_value(
                    instance,
                    "destination_description",
                    self.language,
                ),
                "image": self.image_url(
                    instance,
                    "destination_image_file",
                    "destination_image_url",
                ),
                "image_alt": localized_value(
                    instance,
                    "destination_image_alt",
                    self.language,
                ),
            },
            "benefits": {
                "title": localized_value(instance, "benefits_title", self.language),
                "description": localized_value(
                    instance,
                    "benefits_description",
                    self.language,
                ),
                "process_items": [
                    {
                        "title": localized_value(item, "title", self.language),
                        "description": localized_value(item, "description", self.language),
                        "href": item.href,
                        "tone": item.tone,
                    }
                    for item in instance.process_items.filter(is_visible=True)
                ],
            },
            "faq_preview": {
                "title": localized_value(instance, "faq_preview_title", self.language),
                "description": localized_value(
                    instance,
                    "faq_preview_description",
                    self.language,
                ),
                "more_details": localized_value(
                    instance,
                    "faq_preview_more_details",
                    self.language,
                ),
            },
            "closing": {
                "title": localized_value(instance, "closing_title", self.language),
                "description": localized_value(
                    instance,
                    "closing_description",
                    self.language,
                ),
                "steps": [
                    localized_value(item, "text", self.language)
                    for item in instance.closing_steps.filter(is_visible=True)
                ],
            },
            "seo": self.serialize_seo(instance, "hero_title", "hero_description"),
        }


class AboutPageContentSerializer(LocalizedSerializer):
    def to_representation(self, instance: AboutPageContent):
        return {
            "eyebrow": localized_value(instance, "eyebrow", self.language),
            "title": localized_value(instance, "title", self.language),
            "description": localized_value(instance, "description", self.language),
            "section": {
                "title": localized_value(instance, "section_title", self.language),
                "description": localized_value(
                    instance,
                    "section_description",
                    self.language,
                ),
            },
            "stats": [
                {
                    "value": localized_value(item, "value", self.language),
                    "label": localized_value(item, "label", self.language),
                }
                for item in instance.stats.filter(is_visible=True)
            ],
            "principles": [
                {
                    "title": localized_value(item, "title", self.language),
                    "description": localized_value(item, "description", self.language),
                }
                for item in instance.principles.filter(is_visible=True)
            ],
            "cta": {
                "title": localized_value(instance, "cta_title", self.language),
                "description": localized_value(instance, "cta_description", self.language),
            },
            "visuals": self.serialize_visuals(instance),
            "seo": self.serialize_seo(instance, "title", "description"),
        }


class ContactsPageContentSerializer(LocalizedSerializer):
    def to_representation(self, instance: ContactsPageContent):
        return {
            "eyebrow": localized_value(instance, "eyebrow", self.language),
            "title": localized_value(instance, "title", self.language),
            "description": localized_value(instance, "description", self.language),
            "summary_labels": {
                "primary": localized_value(
                    instance,
                    "summary_primary_label",
                    self.language,
                ),
                "hours": localized_value(instance, "summary_hours_label", self.language),
                "coverage": localized_value(
                    instance,
                    "summary_coverage_label",
                    self.language,
                ),
            },
            "highlights": [
                {
                    "title": localized_value(item, "title", self.language),
                    "detail": localized_value(item, "detail", self.language),
                }
                for item in instance.highlights.filter(is_visible=True)
            ],
            "entry_section": {
                "title": localized_value(instance, "entry_section_title", self.language),
                "description": localized_value(
                    instance,
                    "entry_section_description",
                    self.language,
                ),
            },
            "entry_cards": [
                {
                    "intent": item.intent,
                    "title": localized_value(item, "title", self.language),
                    "description": localized_value(item, "description", self.language),
                    "action_label": localized_value(
                        item,
                        "action_label",
                        self.language,
                    ),
                }
                for item in instance.entry_cards.filter(is_visible=True)
            ],
            "channels": {
                "title": localized_value(instance, "channels_title", self.language),
                "description": localized_value(
                    instance,
                    "channels_description",
                    self.language,
                ),
            },
            "form_section": {
                "title": localized_value(instance, "form_section_title", self.language),
                "description": localized_value(
                    instance,
                    "form_section_description",
                    self.language,
                ),
            },
            "visuals": self.serialize_visuals(instance),
            "seo": self.serialize_seo(instance, "title", "description"),
        }


class FaqPageContentSerializer(LocalizedSerializer):
    def to_representation(self, instance: FaqPageContent):
        return {
            "eyebrow": localized_value(instance, "eyebrow", self.language),
            "title": localized_value(instance, "title", self.language),
            "description": localized_value(instance, "description", self.language),
            "cta": {
                "title": localized_value(instance, "cta_title", self.language),
                "description": localized_value(instance, "cta_description", self.language),
            },
            "visuals": self.serialize_visuals(instance),
            "seo": self.serialize_seo(instance, "title", "description"),
        }


class FAQItemSerializer(LocalizedSerializer):
    def to_representation(self, instance):
        return {
            "id": instance.anchor,
            "question": localized_value(instance, "question", self.language),
            "answer": localized_value(instance, "answer", self.language),
        }


class HowItWorksPageContentSerializer(LocalizedSerializer):
    def to_representation(self, instance: HowItWorksPageContent):
        return {
            "eyebrow": localized_value(instance, "eyebrow", self.language),
            "title": localized_value(instance, "title", self.language),
            "description": localized_value(instance, "description", self.language),
            "steps": [
                {
                    "title": localized_value(item, "title", self.language),
                    "description": localized_value(item, "description", self.language),
                }
                for item in instance.steps.filter(is_visible=True)
            ],
            "highlights": [
                {
                    "title": localized_value(item, "title", self.language),
                    "description": localized_value(item, "description", self.language),
                }
                for item in instance.highlights.filter(is_visible=True)
            ],
            "cta": {
                "title": localized_value(instance, "cta_title", self.language),
                "description": localized_value(instance, "cta_description", self.language),
                "faq_label": localized_value(instance, "cta_faq_label", self.language),
            },
            "visuals": self.serialize_visuals(instance),
            "seo": self.serialize_seo(instance, "title", "description"),
        }


class LegalPageContentSerializer(LocalizedSerializer):
    def to_representation(self, instance: LegalPageContent):
        return {
            "page_key": instance.page_key,
            "eyebrow": localized_value(instance, "eyebrow", self.language),
            "title": localized_value(instance, "title", self.language),
            "description": localized_value(instance, "description", self.language),
            "sections": [
                {
                    "title": localized_value(item, "title", self.language),
                    "items": split_bullets(
                        localized_value(item, "items", self.language),
                    ),
                }
                for item in instance.sections.filter(is_visible=True)
            ],
            "cta": {
                "title": localized_value(instance, "cta_title", self.language),
                "description": localized_value(instance, "cta_description", self.language),
            },
            "visuals": self.serialize_visuals(instance),
            "seo": self.serialize_seo(instance, "title", "description"),
        }


class ThankYouPageContentSerializer(LocalizedSerializer):
    def to_representation(self, instance: ThankYouPageContent):
        return {
            "eyebrow": localized_value(instance, "eyebrow", self.language),
            "title": localized_value(instance, "title", self.language),
            "description_with_car": localized_value(
                instance,
                "description_with_car",
                self.language,
            ),
            "description_without_car": localized_value(
                instance,
                "description_without_car",
                self.language,
            ),
            "description_end": localized_value(
                instance,
                "description_end",
                self.language,
            ),
            "dates": {
                "start": localized_value(instance, "dates_start_label", self.language),
                "end": localized_value(instance, "dates_end_label", self.language),
            },
            "steps": [
                {
                    "title": localized_value(item, "title", self.language),
                    "description": localized_value(item, "description", self.language),
                }
                for item in instance.steps.filter(is_visible=True)
            ],
            "actions": {
                "primary": localized_value(
                    instance,
                    "primary_action_label",
                    self.language,
                ),
                "secondary": localized_value(
                    instance,
                    "secondary_action_label",
                    self.language,
                ),
            },
            "visuals": self.serialize_visuals(instance),
            "seo": self.serialize_seo(instance, "title", "description_without_car"),
        }
