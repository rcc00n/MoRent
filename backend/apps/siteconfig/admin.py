from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.html import format_html

from .models import (
    AboutPageContent,
    AboutPrinciple,
    AboutStat,
    ContactEntryCard,
    ContactsHighlight,
    ContactsPageContent,
    FAQItem,
    FaqPageContent,
    HomeClosingStep,
    HomePageContent,
    HomeProcessItem,
    HowItWorksHighlight,
    HowItWorksPageContent,
    HowItWorksStep,
    LegalPageContent,
    LegalSection,
    SiteSettings,
    ThankYouPageContent,
    ThankYouStep,
)


class SingletonAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not self.model.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = self.model.objects.first()
        if obj:
            return HttpResponseRedirect(
                reverse(
                    f"admin:{self.model._meta.app_label}_{self.model._meta.model_name}_change",
                    args=(obj.pk,),
                )
            )
        return super().changelist_view(request, extra_context)


class OrderedInline(admin.TabularInline):
    extra = 0
    ordering = ("sort_order", "id")
    fields = ("sort_order", "is_visible")


class ImagePreviewAdminMixin:
    def render_image_preview(self, url: str):
        if not url:
            return "No image selected"

        return format_html(
            '<a href="{}" target="_blank" rel="noreferrer">'
            '<img src="{}" alt="" style="max-width: 240px; border-radius: 12px;" />'
            "</a>",
            url,
            url,
        )

    @admin.display(description="Primary image preview")
    def primary_image_preview(self, obj):
        image_field = getattr(obj, "primary_image_file", None)
        image_url = image_field.url if image_field else getattr(obj, "primary_image_url", "")
        return self.render_image_preview(image_url)

    @admin.display(description="Secondary image preview")
    def secondary_image_preview(self, obj):
        image_field = getattr(obj, "secondary_image_file", None)
        image_url = image_field.url if image_field else getattr(obj, "secondary_image_url", "")
        return self.render_image_preview(image_url)


class HomeProcessItemInline(OrderedInline):
    model = HomeProcessItem
    fields = (
        "sort_order",
        "is_visible",
        "title_en",
        "title_ru",
        "description_en",
        "description_ru",
        "href",
        "tone",
    )


class HomeClosingStepInline(OrderedInline):
    model = HomeClosingStep
    fields = ("sort_order", "is_visible", "text_en", "text_ru")


class AboutStatInline(OrderedInline):
    model = AboutStat
    fields = ("sort_order", "is_visible", "value_en", "value_ru", "label_en", "label_ru")


class AboutPrincipleInline(OrderedInline):
    model = AboutPrinciple
    fields = (
        "sort_order",
        "is_visible",
        "title_en",
        "title_ru",
        "description_en",
        "description_ru",
    )


class ContactsHighlightInline(OrderedInline):
    model = ContactsHighlight
    fields = (
        "sort_order",
        "is_visible",
        "title_en",
        "title_ru",
        "detail_en",
        "detail_ru",
    )


class ContactEntryCardInline(OrderedInline):
    model = ContactEntryCard
    fields = (
        "sort_order",
        "is_visible",
        "intent",
        "title_en",
        "title_ru",
        "description_en",
        "description_ru",
        "action_label_en",
        "action_label_ru",
    )


class FAQItemInline(OrderedInline):
    model = FAQItem
    fields = (
        "sort_order",
        "is_visible",
        "anchor",
        "question_en",
        "question_ru",
        "answer_en",
        "answer_ru",
    )


class HowItWorksStepInline(OrderedInline):
    model = HowItWorksStep
    fields = (
        "sort_order",
        "is_visible",
        "title_en",
        "title_ru",
        "description_en",
        "description_ru",
    )


class HowItWorksHighlightInline(OrderedInline):
    model = HowItWorksHighlight
    fields = (
        "sort_order",
        "is_visible",
        "title_en",
        "title_ru",
        "description_en",
        "description_ru",
    )


class LegalSectionInline(OrderedInline):
    model = LegalSection
    fields = (
        "sort_order",
        "is_visible",
        "title_en",
        "title_ru",
        "items_en",
        "items_ru",
    )


class ThankYouStepInline(OrderedInline):
    model = ThankYouStep
    fields = (
        "sort_order",
        "is_visible",
        "title_en",
        "title_ru",
        "description_en",
        "description_ru",
    )


@admin.register(SiteSettings)
class SiteSettingsAdmin(SingletonAdmin):
    fieldsets = (
        (
            "Brand",
            {
                "fields": (
                    "brand_name",
                    "company_name",
                )
            },
        ),
        (
            "Contact channels",
            {
                "fields": (
                    ("phone", "email"),
                    ("whatsapp_url", "telegram_url"),
                    ("instagram_url", "facebook_url"),
                )
            },
        ),
        (
            "Editable labels",
            {
                "fields": (
                    ("primary_cta_label_en", "primary_cta_label_ru"),
                    ("availability_cta_label_en", "availability_cta_label_ru"),
                    ("contact_cta_label_en", "contact_cta_label_ru"),
                    ("consultation_label_en", "consultation_label_ru"),
                    ("support_label_en", "support_label_ru"),
                    ("footer_request_label_en", "footer_request_label_ru"),
                    ("footer_service_label_en", "footer_service_label_ru"),
                )
            },
        ),
        (
            "Business text",
            {
                "fields": (
                    ("contact_availability_text_en", "contact_availability_text_ru"),
                    ("pickup_location_text_en", "pickup_location_text_ru"),
                    ("working_hours_en", "working_hours_ru"),
                    ("footer_title_en", "footer_title_ru"),
                    ("footer_text_en", "footer_text_ru"),
                )
            },
        ),
        (
            "Default SEO",
            {
                "classes": ("collapse",),
                "fields": (
                    ("seo_default_title_en", "seo_default_title_ru"),
                    ("seo_default_description_en", "seo_default_description_ru"),
                    (
                        "seo_organization_description_en",
                        "seo_organization_description_ru",
                    ),
                ),
            },
        ),
    )


@admin.register(HomePageContent)
class HomePageContentAdmin(SingletonAdmin, ImagePreviewAdminMixin):
    inlines = (HomeProcessItemInline, HomeClosingStepInline)
    readonly_fields = ("hero_background_preview", "destination_image_preview")
    fieldsets = (
        (
            "Hero",
            {
                "fields": (
                    ("hero_title_en", "hero_title_ru"),
                    ("hero_description_en", "hero_description_ru"),
                    ("hero_background_image_file", "hero_background_image_url"),
                    "hero_background_preview",
                )
            },
        ),
        (
            "Featured and signal sections",
            {
                "fields": (
                    ("signal_title_en", "signal_title_ru"),
                    ("featured_title_en", "featured_title_ru"),
                    ("featured_description_en", "featured_description_ru"),
                    ("featured_more_options_en", "featured_more_options_ru"),
                )
            },
        ),
        (
            "Destination and benefits",
            {
                "fields": (
                    ("destination_title_en", "destination_title_ru"),
                    ("destination_description_en", "destination_description_ru"),
                    ("destination_image_file", "destination_image_url"),
                    "destination_image_preview",
                    ("destination_image_alt_en", "destination_image_alt_ru"),
                    ("benefits_title_en", "benefits_title_ru"),
                    ("benefits_description_en", "benefits_description_ru"),
                )
            },
        ),
        (
            "FAQ preview and closing",
            {
                "fields": (
                    ("faq_preview_title_en", "faq_preview_title_ru"),
                    ("faq_preview_description_en", "faq_preview_description_ru"),
                    ("faq_preview_more_details_en", "faq_preview_more_details_ru"),
                    ("closing_title_en", "closing_title_ru"),
                    ("closing_description_en", "closing_description_ru"),
                )
            },
        ),
        (
            "SEO",
            {
                "classes": ("collapse",),
                "fields": (
                    ("seo_title_en", "seo_title_ru"),
                    ("seo_description_en", "seo_description_ru"),
                ),
            },
        ),
    )

    @admin.display(description="Hero background preview")
    def hero_background_preview(self, obj):
        image_field = getattr(obj, "hero_background_image_file", None)
        image_url = image_field.url if image_field else getattr(obj, "hero_background_image_url", "")
        return self.render_image_preview(image_url)

    @admin.display(description="Destination image preview")
    def destination_image_preview(self, obj):
        image_field = getattr(obj, "destination_image_file", None)
        image_url = image_field.url if image_field else getattr(obj, "destination_image_url", "")
        return self.render_image_preview(image_url)


@admin.register(AboutPageContent)
class AboutPageContentAdmin(SingletonAdmin, ImagePreviewAdminMixin):
    inlines = (AboutStatInline, AboutPrincipleInline)
    readonly_fields = ("primary_image_preview", "secondary_image_preview")
    fieldsets = (
        (
            "Page copy",
            {
                "fields": (
                    ("eyebrow_en", "eyebrow_ru"),
                    ("title_en", "title_ru"),
                    ("description_en", "description_ru"),
                    ("section_title_en", "section_title_ru"),
                    ("section_description_en", "section_description_ru"),
                    ("cta_title_en", "cta_title_ru"),
                    ("cta_description_en", "cta_description_ru"),
                )
            },
        ),
        (
            "Visuals",
            {
                "fields": (
                    ("primary_image_file", "primary_image_url"),
                    "primary_image_preview",
                    ("primary_image_alt_en", "primary_image_alt_ru"),
                    ("primary_image_caption_en", "primary_image_caption_ru"),
                    ("secondary_image_file", "secondary_image_url"),
                    "secondary_image_preview",
                    ("secondary_image_alt_en", "secondary_image_alt_ru"),
                    ("secondary_image_caption_en", "secondary_image_caption_ru"),
                )
            },
        ),
        (
            "SEO",
            {
                "classes": ("collapse",),
                "fields": (
                    ("seo_title_en", "seo_title_ru"),
                    ("seo_description_en", "seo_description_ru"),
                ),
            },
        ),
    )


@admin.register(ContactsPageContent)
class ContactsPageContentAdmin(SingletonAdmin, ImagePreviewAdminMixin):
    inlines = (ContactsHighlightInline, ContactEntryCardInline)
    readonly_fields = ("primary_image_preview", "secondary_image_preview")
    fieldsets = (
        (
            "Page copy",
            {
                "fields": (
                    ("eyebrow_en", "eyebrow_ru"),
                    ("title_en", "title_ru"),
                    ("description_en", "description_ru"),
                )
            },
        ),
        (
            "Summary labels",
            {
                "description": "The visible values are pulled from Site settings.",
                "fields": (
                    ("summary_primary_label_en", "summary_primary_label_ru"),
                    ("summary_hours_label_en", "summary_hours_label_ru"),
                    ("summary_coverage_label_en", "summary_coverage_label_ru"),
                ),
            },
        ),
        (
            "Sections",
            {
                "fields": (
                    ("entry_section_title_en", "entry_section_title_ru"),
                    ("entry_section_description_en", "entry_section_description_ru"),
                    ("channels_title_en", "channels_title_ru"),
                    ("channels_description_en", "channels_description_ru"),
                    ("form_section_title_en", "form_section_title_ru"),
                    ("form_section_description_en", "form_section_description_ru"),
                )
            },
        ),
        (
            "Visuals",
            {
                "fields": (
                    ("primary_image_file", "primary_image_url"),
                    "primary_image_preview",
                    ("primary_image_alt_en", "primary_image_alt_ru"),
                    ("primary_image_caption_en", "primary_image_caption_ru"),
                    ("secondary_image_file", "secondary_image_url"),
                    "secondary_image_preview",
                    ("secondary_image_alt_en", "secondary_image_alt_ru"),
                    ("secondary_image_caption_en", "secondary_image_caption_ru"),
                )
            },
        ),
        (
            "SEO",
            {
                "classes": ("collapse",),
                "fields": (
                    ("seo_title_en", "seo_title_ru"),
                    ("seo_description_en", "seo_description_ru"),
                ),
            },
        ),
    )


@admin.register(FaqPageContent)
class FaqPageContentAdmin(SingletonAdmin, ImagePreviewAdminMixin):
    inlines = (FAQItemInline,)
    readonly_fields = ("primary_image_preview", "secondary_image_preview")
    fieldsets = (
        (
            "Page copy",
            {
                "fields": (
                    ("eyebrow_en", "eyebrow_ru"),
                    ("title_en", "title_ru"),
                    ("description_en", "description_ru"),
                    ("cta_title_en", "cta_title_ru"),
                    ("cta_description_en", "cta_description_ru"),
                )
            },
        ),
        (
            "Visuals",
            {
                "fields": (
                    ("primary_image_file", "primary_image_url"),
                    "primary_image_preview",
                    ("primary_image_alt_en", "primary_image_alt_ru"),
                    ("primary_image_caption_en", "primary_image_caption_ru"),
                    ("secondary_image_file", "secondary_image_url"),
                    "secondary_image_preview",
                    ("secondary_image_alt_en", "secondary_image_alt_ru"),
                    ("secondary_image_caption_en", "secondary_image_caption_ru"),
                )
            },
        ),
        (
            "SEO",
            {
                "classes": ("collapse",),
                "fields": (
                    ("seo_title_en", "seo_title_ru"),
                    ("seo_description_en", "seo_description_ru"),
                ),
            },
        ),
    )


@admin.register(HowItWorksPageContent)
class HowItWorksPageContentAdmin(SingletonAdmin, ImagePreviewAdminMixin):
    inlines = (HowItWorksStepInline, HowItWorksHighlightInline)
    readonly_fields = ("primary_image_preview", "secondary_image_preview")
    fieldsets = (
        (
            "Page copy",
            {
                "fields": (
                    ("eyebrow_en", "eyebrow_ru"),
                    ("title_en", "title_ru"),
                    ("description_en", "description_ru"),
                    ("cta_title_en", "cta_title_ru"),
                    ("cta_description_en", "cta_description_ru"),
                    ("cta_faq_label_en", "cta_faq_label_ru"),
                )
            },
        ),
        (
            "Visuals",
            {
                "fields": (
                    ("primary_image_file", "primary_image_url"),
                    "primary_image_preview",
                    ("primary_image_alt_en", "primary_image_alt_ru"),
                    ("primary_image_caption_en", "primary_image_caption_ru"),
                    ("secondary_image_file", "secondary_image_url"),
                    "secondary_image_preview",
                    ("secondary_image_alt_en", "secondary_image_alt_ru"),
                    ("secondary_image_caption_en", "secondary_image_caption_ru"),
                )
            },
        ),
        (
            "SEO",
            {
                "classes": ("collapse",),
                "fields": (
                    ("seo_title_en", "seo_title_ru"),
                    ("seo_description_en", "seo_description_ru"),
                ),
            },
        ),
    )


@admin.register(LegalPageContent)
class LegalPageContentAdmin(ImagePreviewAdminMixin, admin.ModelAdmin):
    inlines = (LegalSectionInline,)
    list_display = ("page_key", "title_en", "title_ru")
    readonly_fields = ("primary_image_preview", "secondary_image_preview")
    fieldsets = (
        (
            "Page",
            {
                "fields": (
                    "page_key",
                    ("eyebrow_en", "eyebrow_ru"),
                    ("title_en", "title_ru"),
                    ("description_en", "description_ru"),
                    ("cta_title_en", "cta_title_ru"),
                    ("cta_description_en", "cta_description_ru"),
                )
            },
        ),
        (
            "Visuals",
            {
                "fields": (
                    ("primary_image_file", "primary_image_url"),
                    "primary_image_preview",
                    ("primary_image_alt_en", "primary_image_alt_ru"),
                    ("primary_image_caption_en", "primary_image_caption_ru"),
                    ("secondary_image_file", "secondary_image_url"),
                    "secondary_image_preview",
                    ("secondary_image_alt_en", "secondary_image_alt_ru"),
                    ("secondary_image_caption_en", "secondary_image_caption_ru"),
                )
            },
        ),
        (
            "SEO",
            {
                "classes": ("collapse",),
                "fields": (
                    ("seo_title_en", "seo_title_ru"),
                    ("seo_description_en", "seo_description_ru"),
                ),
            },
        ),
    )


@admin.register(ThankYouPageContent)
class ThankYouPageContentAdmin(SingletonAdmin, ImagePreviewAdminMixin):
    inlines = (ThankYouStepInline,)
    readonly_fields = ("primary_image_preview", "secondary_image_preview")
    fieldsets = (
        (
            "Page copy",
            {
                "fields": (
                    ("eyebrow_en", "eyebrow_ru"),
                    ("title_en", "title_ru"),
                    ("description_with_car_en", "description_with_car_ru"),
                    ("description_without_car_en", "description_without_car_ru"),
                    ("description_end_en", "description_end_ru"),
                )
            },
        ),
        (
            "Date and action labels",
            {
                "fields": (
                    ("dates_start_label_en", "dates_start_label_ru"),
                    ("dates_end_label_en", "dates_end_label_ru"),
                    ("primary_action_label_en", "primary_action_label_ru"),
                    ("secondary_action_label_en", "secondary_action_label_ru"),
                )
            },
        ),
        (
            "Visuals",
            {
                "fields": (
                    ("primary_image_file", "primary_image_url"),
                    "primary_image_preview",
                    ("primary_image_alt_en", "primary_image_alt_ru"),
                    ("primary_image_caption_en", "primary_image_caption_ru"),
                    ("secondary_image_file", "secondary_image_url"),
                    "secondary_image_preview",
                    ("secondary_image_alt_en", "secondary_image_alt_ru"),
                    ("secondary_image_caption_en", "secondary_image_caption_ru"),
                )
            },
        ),
        (
            "SEO",
            {
                "classes": ("collapse",),
                "fields": (
                    ("seo_title_en", "seo_title_ru"),
                    ("seo_description_en", "seo_description_ru"),
                ),
            },
        ),
    )
