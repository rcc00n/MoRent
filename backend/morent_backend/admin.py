from django.contrib.admin import AdminSite
from django.db.models import Count, Q
from django.urls import reverse

from apps.siteconfig.utils import get_site_settings


class MoRentAdminSite(AdminSite):
    site_header = "MoRent Control Room"
    site_title = "MoRent Admin"
    index_title = "Operations dashboard"
    index_template = "admin/morent_index.html"
    enable_nav_sidebar = True

    def each_context(self, request):
        context = super().each_context(request)
        contact_channels = []
        site_settings = get_site_settings()

        if site_settings.phone:
            contact_channels.append(
                {
                    "label": "Phone",
                    "value": site_settings.phone,
                }
            )

        if site_settings.email:
            contact_channels.append(
                {
                    "label": "Email",
                    "value": site_settings.email,
                }
            )

        if site_settings.whatsapp_url:
            contact_channels.append(
                {
                    "label": "WhatsApp",
                    "value": site_settings.whatsapp_url,
                }
            )

        if site_settings.telegram_url:
            contact_channels.append(
                {
                    "label": "Telegram",
                    "value": site_settings.telegram_url,
                }
            )

        context.update(
            {
                "morent_admin_tagline": "Lead desk, bookings, and fleet operations.",
                "morent_contact_channels": contact_channels,
                "morent_service_hours": site_settings.working_hours_en
                or site_settings.working_hours_ru,
            }
        )
        return context

    def index(self, request, extra_context=None):
        from apps.bookings.models import Booking

        request_counts = {
            row["request_type"]: row["total"]
            for row in Booking.objects.values("request_type").annotate(total=Count("id"))
        }
        status_counts = {
            row["status"]: row["total"]
            for row in Booking.objects.values("status").annotate(total=Count("id"))
        }
        latest_requests = Booking.objects.select_related("car")[:8]

        dashboard_cards = [
            {
                "label": "Total requests",
                "value": Booking.objects.count(),
                "hint": "All booking, consultation, and support enquiries.",
            },
            {
                "label": "New requests",
                "value": status_counts.get(Booking.LeadStatus.NEW, 0),
                "hint": "Fresh leads waiting for first follow-up.",
            },
            {
                "label": "Booking intents",
                "value": request_counts.get(Booking.RequestType.BOOKING, 0),
                "hint": "Requests tied to a specific vehicle and rental window.",
            },
            {
                "label": "Contact + support",
                "value": request_counts.get(Booking.RequestType.CONTACT, 0)
                + request_counts.get(Booking.RequestType.SUPPORT, 0),
                "hint": "General consultations and follow-up questions.",
            },
            {
                "label": "Needs CRM sync",
                "value": Booking.objects.filter(crm_sync_status=Booking.CrmSyncStatus.PENDING).count(),
                "hint": "Lead records still waiting for downstream sync.",
            },
            {
                "label": "In progress",
                "value": Booking.objects.filter(
                    Q(status=Booking.LeadStatus.REVIEWING)
                    | Q(status=Booking.LeadStatus.CONTACTED)
                ).count(),
                "hint": "Requests currently being handled by an operator.",
            },
        ]

        extra_context = extra_context or {}
        extra_context.update(
            {
                "dashboard_cards": dashboard_cards,
                "request_type_counts": [
                    {
                        "label": "Booking requests",
                        "value": request_counts.get(Booking.RequestType.BOOKING, 0),
                    },
                    {
                        "label": "Contact requests",
                        "value": request_counts.get(Booking.RequestType.CONTACT, 0),
                    },
                    {
                        "label": "Support requests",
                        "value": request_counts.get(Booking.RequestType.SUPPORT, 0),
                    },
                ],
                "status_counts": [
                    {
                        "label": "New",
                        "value": status_counts.get(Booking.LeadStatus.NEW, 0),
                    },
                    {
                        "label": "Reviewing",
                        "value": status_counts.get(Booking.LeadStatus.REVIEWING, 0),
                    },
                    {
                        "label": "Contacted",
                        "value": status_counts.get(Booking.LeadStatus.CONTACTED, 0),
                    },
                    {
                        "label": "Closed",
                        "value": status_counts.get(Booking.LeadStatus.CLOSED, 0),
                    },
                ],
                "latest_requests": latest_requests,
                "booking_changelist_url": reverse("admin:bookings_booking_changelist"),
            }
        )
        return super().index(request, extra_context=extra_context)
