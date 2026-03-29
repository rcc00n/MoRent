from django.contrib.admin import AdminSite
from django.db.models import Count, Q
from django.urls import reverse

from apps.siteconfig.utils import get_site_settings


class MoRentAdminSite(AdminSite):
    APP_ORDER = {
        "bookings": 0,
        "cars": 1,
        "siteconfig": 2,
    }
    MODEL_ORDER = {
        "bookings": {
            "booking": 0,
        },
        "cars": {
            "car": 0,
            "cargalleryimage": 1,
        },
        "siteconfig": {
            "sitesettings": 0,
            "homepagecontent": 1,
            "aboutpagecontent": 2,
            "contactspagecontent": 3,
            "faqpagecontent": 4,
            "howitworkspagecontent": 5,
            "legalpagecontent": 6,
            "thankyoupagecontent": 7,
        },
    }
    site_header = "MoRent Control Room"
    site_title = "MoRent Admin"
    index_title = "Operations dashboard"
    index_template = "admin/morent_index.html"
    enable_nav_sidebar = True

    @staticmethod
    def compact_channel_value(channel_type: str, raw_value: str) -> str:
        value = str(raw_value or "").strip()

        if not value:
            return ""

        if channel_type in {"whatsapp", "telegram"}:
            return "Connected"

        return value

    @staticmethod
    def request_tone(request_type: str) -> str:
        return {
            "booking_request": "booking",
            "contact_request": "contact",
            "support_request": "support",
        }.get(request_type, "neutral")

    @staticmethod
    def status_tone(status: str) -> str:
        return {
            "new": "pending",
            "reviewing": "reviewing",
            "contacted": "contacted",
            "closed": "closed",
        }.get(status, "neutral")

    @staticmethod
    def crm_tone(status: str) -> str:
        return {
            "pending": "pending",
            "synced": "synced",
            "failed": "failed",
            "skipped": "skipped",
        }.get(status, "neutral")

    def get_app_list(self, request, app_label=None):
        app_list = super().get_app_list(request, app_label=app_label)

        for app in app_list:
            model_order = self.MODEL_ORDER.get(app["app_label"], {})
            app["models"].sort(
                key=lambda model: (
                    model_order.get(model["object_name"].lower(), 99),
                    model["name"],
                )
            )

        return sorted(
            app_list,
            key=lambda app: (
                self.APP_ORDER.get(app["app_label"], 99),
                app["name"],
            ),
        )

    def each_context(self, request):
        context = super().each_context(request)
        contact_channels = []
        site_settings = get_site_settings()

        if site_settings.phone:
            contact_channels.append(
                {
                    "label": "Phone",
                    "value": self.compact_channel_value("phone", site_settings.phone),
                }
            )

        if site_settings.email:
            contact_channels.append(
                {
                    "label": "Email",
                    "value": self.compact_channel_value("email", site_settings.email),
                }
            )

        if site_settings.whatsapp_url:
            contact_channels.append(
                {
                    "label": "WhatsApp",
                    "value": self.compact_channel_value("whatsapp", site_settings.whatsapp_url),
                }
            )

        if site_settings.telegram_url:
            contact_channels.append(
                {
                    "label": "Telegram",
                    "value": self.compact_channel_value("telegram", site_settings.telegram_url),
                }
            )

        context.update(
            {
                "morent_admin_tagline": "Premium control panel for leads, fleet, and site content.",
                "morent_contact_channels": contact_channels,
                "morent_service_hours": site_settings.working_hours_en
                or site_settings.working_hours_ru,
            }
        )
        return context

    def index(self, request, extra_context=None):
        from apps.cars.models import Car, CarGalleryImage
        from apps.bookings.models import Booking
        from apps.siteconfig.models import (
            AboutPageContent,
            ContactsPageContent,
            FAQItem,
            FaqPageContent,
            HomePageContent,
            HowItWorksPageContent,
            LegalPageContent,
            SiteSettings,
            ThankYouPageContent,
        )

        request_counts = {
            row["request_type"]: row["total"]
            for row in Booking.objects.values("request_type").annotate(total=Count("id"))
        }
        status_counts = {
            row["status"]: row["total"]
            for row in Booking.objects.values("status").annotate(total=Count("id"))
        }
        all_requests_count = Booking.objects.count()
        pending_sync_count = Booking.objects.filter(
            crm_sync_status=Booking.CrmSyncStatus.PENDING
        ).count()
        in_progress_count = Booking.objects.filter(
            Q(status=Booking.LeadStatus.REVIEWING)
            | Q(status=Booking.LeadStatus.CONTACTED)
        ).count()
        visible_car_count = Car.objects.filter(is_visible=True).count()
        featured_car_count = Car.objects.filter(is_visible=True, is_featured=True).count()
        configured_pages = sum(
            model.objects.exists()
            for model in (
                HomePageContent,
                AboutPageContent,
                ContactsPageContent,
                FaqPageContent,
                HowItWorksPageContent,
                ThankYouPageContent,
            )
        )

        latest_requests = []
        for lead in Booking.objects.select_related("car")[:8]:
            source_meta = []

            if lead.source_context.get("locale"):
                source_meta.append(lead.source_context["locale"])

            if lead.source_context.get("entry_point"):
                source_meta.append(lead.source_context["entry_point"])

            latest_requests.append(
                {
                    "created_at": lead.created_at,
                    "change_url": reverse("admin:bookings_booking_change", args=[lead.pk]),
                    "name": lead.name,
                    "intent_label": lead.get_request_type_display(),
                    "intent_tone": self.request_tone(lead.request_type),
                    "status_label": lead.get_status_display(),
                    "status_tone": self.status_tone(lead.status),
                    "crm_label": lead.get_crm_sync_status_display(),
                    "crm_tone": self.crm_tone(lead.crm_sync_status),
                    "vehicle_label": str(lead.car) if lead.car else "Flexible enquiry",
                    "source_label": lead.source or "website",
                    "source_meta": " / ".join(source_meta),
                }
            )

        dashboard_cards = [
            {
                "label": "Total requests",
                "value": all_requests_count,
                "hint": "All booking, consultation, and support enquiries.",
                "tone": "primary",
            },
            {
                "label": "New requests",
                "value": status_counts.get(Booking.LeadStatus.NEW, 0),
                "hint": "Fresh leads waiting for first follow-up.",
                "tone": "warning",
            },
            {
                "label": "Booking intents",
                "value": request_counts.get(Booking.RequestType.BOOKING, 0),
                "hint": "Requests tied to a specific vehicle and rental window.",
                "tone": "accent",
            },
            {
                "label": "Contact + support",
                "value": request_counts.get(Booking.RequestType.CONTACT, 0)
                + request_counts.get(Booking.RequestType.SUPPORT, 0),
                "hint": "General consultations and follow-up questions.",
                "tone": "neutral",
            },
            {
                "label": "Needs CRM sync",
                "value": pending_sync_count,
                "hint": "Lead records still waiting for downstream sync.",
                "tone": "danger",
            },
            {
                "label": "In progress",
                "value": in_progress_count,
                "hint": "Requests currently being handled by an operator.",
                "tone": "success",
            },
        ]

        extra_context = extra_context or {}
        extra_context.update(
            {
                "dashboard_cards": dashboard_cards,
                "dashboard_actions": [
                    {
                        "label": "Open requests",
                        "url": reverse("admin:bookings_booking_changelist"),
                    },
                    {
                        "label": "Manage fleet",
                        "url": reverse("admin:cars_car_changelist"),
                    },
                    {
                        "label": "Site settings",
                        "url": reverse("admin:siteconfig_sitesettings_changelist"),
                    },
                ],
                "dashboard_sections": [
                    {
                        "title": "Lead desk",
                        "description": "Work the full request queue from first response through CRM sync.",
                        "items": [
                            {
                                "label": "All requests",
                                "value": all_requests_count,
                                "detail": "Booking, contact, and support enquiries.",
                                "url": reverse("admin:bookings_booking_changelist"),
                            },
                            {
                                "label": "New leads",
                                "value": status_counts.get(Booking.LeadStatus.NEW, 0),
                                "detail": "Awaiting the first follow-up.",
                                "url": reverse("admin:bookings_booking_changelist"),
                            },
                            {
                                "label": "CRM pending",
                                "value": pending_sync_count,
                                "detail": "Still waiting for downstream sync.",
                                "url": reverse("admin:bookings_booking_changelist"),
                            },
                        ],
                    },
                    {
                        "title": "Fleet and pricing",
                        "description": "Keep the public inventory current and home-page highlights accurate.",
                        "items": [
                            {
                                "label": "Fleet records",
                                "value": Car.objects.count(),
                                "detail": "All cars stored in admin.",
                                "url": reverse("admin:cars_car_changelist"),
                            },
                            {
                                "label": "Visible cars",
                                "value": visible_car_count,
                                "detail": "Currently published to the site.",
                                "url": reverse("admin:cars_car_changelist"),
                            },
                            {
                                "label": "Featured cars",
                                "value": featured_car_count,
                                "detail": "Prioritized on the homepage.",
                                "url": reverse("admin:cars_car_changelist"),
                            },
                            {
                                "label": "Gallery items",
                                "value": CarGalleryImage.objects.filter(is_visible=True).count(),
                                "detail": "Additional vehicle imagery in rotation.",
                                "url": reverse("admin:cars_car_changelist"),
                            },
                        ],
                    },
                    {
                        "title": "Content and settings",
                        "description": "Update bilingual copy, FAQ, legal content, and operational details.",
                        "items": [
                            {
                                "label": "Site settings",
                                "value": "Ready" if SiteSettings.objects.exists() else "Setup",
                                "detail": "Brand, contact, CTA, and SEO defaults.",
                                "url": reverse("admin:siteconfig_sitesettings_changelist"),
                            },
                            {
                                "label": "Configured pages",
                                "value": configured_pages,
                                "detail": "Home, about, contacts, FAQ, how-it-works, and thank-you.",
                                "url": reverse("admin:siteconfig_homepagecontent_changelist"),
                            },
                            {
                                "label": "Visible FAQs",
                                "value": FAQItem.objects.filter(is_visible=True).count(),
                                "detail": "Public answers live on the site.",
                                "url": reverse("admin:siteconfig_faqpagecontent_changelist"),
                            },
                            {
                                "label": "Legal pages",
                                "value": LegalPageContent.objects.count(),
                                "detail": "Terms and privacy content entries.",
                                "url": reverse("admin:siteconfig_legalpagecontent_changelist"),
                            },
                        ],
                    },
                ],
                "request_type_counts": [
                    {
                        "label": "Booking requests",
                        "value": request_counts.get(Booking.RequestType.BOOKING, 0),
                        "tone": "booking",
                    },
                    {
                        "label": "Contact requests",
                        "value": request_counts.get(Booking.RequestType.CONTACT, 0),
                        "tone": "contact",
                    },
                    {
                        "label": "Support requests",
                        "value": request_counts.get(Booking.RequestType.SUPPORT, 0),
                        "tone": "support",
                    },
                ],
                "status_counts": [
                    {
                        "label": "New",
                        "value": status_counts.get(Booking.LeadStatus.NEW, 0),
                        "tone": "pending",
                    },
                    {
                        "label": "Reviewing",
                        "value": status_counts.get(Booking.LeadStatus.REVIEWING, 0),
                        "tone": "reviewing",
                    },
                    {
                        "label": "Contacted",
                        "value": status_counts.get(Booking.LeadStatus.CONTACTED, 0),
                        "tone": "contacted",
                    },
                    {
                        "label": "Closed",
                        "value": status_counts.get(Booking.LeadStatus.CLOSED, 0),
                        "tone": "closed",
                    },
                ],
                "latest_requests": latest_requests,
                "booking_changelist_url": reverse("admin:bookings_booking_changelist"),
            }
        )
        return super().index(request, extra_context=extra_context)
