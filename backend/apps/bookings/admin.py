import json

from django.contrib import admin
from django.db.models import Q
from django.utils.dateparse import parse_date
from django.utils.formats import date_format
from django.utils.html import format_html

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    date_hierarchy = "created_at"
    empty_value_display = "Not provided"
    list_display = (
        "id",
        "received_at",
        "name",
        "request_type_badge",
        "status_badge",
        "crm_sync_badge",
        "contact_details",
        "car",
        "booking_window",
        "source_summary",
    )
    list_filter = (
        "request_type",
        "status",
        "crm_sync_status",
        "preferred_contact_method",
        "source",
        ("car", admin.RelatedOnlyFieldListFilter),
        "created_at",
    )
    search_fields = (
        "name",
        "phone",
        "email",
        "car__brand",
        "car__model",
        "source",
        "crm_external_id",
    )
    search_help_text = "Search by name, phone, email, date, source, vehicle, or CRM ID."
    ordering = ("-created_at",)
    list_per_page = 30
    list_select_related = ("car",)
    save_on_top = True
    readonly_fields = ("source_context_pretty", "created_at", "updated_at", "crm_last_synced_at")
    fieldsets = (
        (
            "Lead overview",
            {
                "fields": (
                    ("name", "request_type"),
                    ("status", "crm_sync_status"),
                    "preferred_contact_method",
                )
            },
        ),
        (
            "Contact details",
            {
                "fields": (
                    ("phone", "email"),
                    "message",
                )
            },
        ),
        (
            "Booking details",
            {
                "fields": (
                    "car",
                    ("start_date", "end_date"),
                )
            },
        ),
        (
            "Lead source",
            {
                "fields": (
                    "source",
                    "source_context_pretty",
                )
            },
        ),
        (
            "CRM sync",
            {
                "fields": (
                    "crm_external_id",
                    "crm_last_synced_at",
                    "crm_sync_error",
                )
            },
        ),
        (
            "Timestamps",
            {
                "classes": ("collapse",),
                "fields": ("created_at", "updated_at"),
            },
        ),
    )
    actions = ("mark_as_reviewing", "mark_as_contacted", "mark_as_closed")

    @admin.action(description="Mark selected requests as reviewing")
    def mark_as_reviewing(self, request, queryset):
        queryset.update(status=Booking.LeadStatus.REVIEWING)

    @admin.action(description="Mark selected requests as contacted")
    def mark_as_contacted(self, request, queryset):
        queryset.update(status=Booking.LeadStatus.CONTACTED)

    @admin.action(description="Mark selected requests as closed")
    def mark_as_closed(self, request, queryset):
        queryset.update(status=Booking.LeadStatus.CLOSED)

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)
        cleaned_search_term = search_term.strip()

        if not cleaned_search_term:
            return queryset, use_distinct

        parsed_search_date = parse_date(cleaned_search_term)
        matching_request_types = [
            request_type
            for request_type, label in Booking.RequestType.choices
            if cleaned_search_term.lower() in {request_type, label.lower()}
        ]

        extra_queryset = self.model.objects.none()

        if parsed_search_date:
            extra_queryset = extra_queryset | self.model.objects.filter(
                Q(created_at__date=parsed_search_date)
                | Q(start_date=parsed_search_date)
                | Q(end_date=parsed_search_date)
            )

        if matching_request_types:
            extra_queryset = extra_queryset | self.model.objects.filter(
                request_type__in=matching_request_types
            )

        return queryset | extra_queryset, use_distinct

    @admin.display(ordering="created_at", description="Received")
    def received_at(self, obj: Booking) -> str:
        return date_format(obj.created_at, "SHORT_DATETIME_FORMAT")

    @admin.display(description="Type")
    def request_type_badge(self, obj: Booking):
        return self.render_badge(
            obj.get_request_type_display(),
            {
                Booking.RequestType.BOOKING: "booking",
                Booking.RequestType.CONTACT: "contact",
                Booking.RequestType.SUPPORT: "support",
            }.get(obj.request_type, "neutral"),
        )

    @admin.display(description="Status")
    def status_badge(self, obj: Booking):
        return self.render_badge(
            obj.get_status_display(),
            {
                Booking.LeadStatus.NEW: "new",
                Booking.LeadStatus.REVIEWING: "reviewing",
                Booking.LeadStatus.CONTACTED: "contacted",
                Booking.LeadStatus.CLOSED: "closed",
            }.get(obj.status, "neutral"),
        )

    @admin.display(description="CRM")
    def crm_sync_badge(self, obj: Booking):
        return self.render_badge(
            obj.get_crm_sync_status_display(),
            {
                Booking.CrmSyncStatus.PENDING: "pending",
                Booking.CrmSyncStatus.SYNCED: "synced",
                Booking.CrmSyncStatus.FAILED: "failed",
                Booking.CrmSyncStatus.SKIPPED: "skipped",
            }.get(obj.crm_sync_status, "neutral"),
        )

    @admin.display(description="Contact")
    def contact_details(self, obj: Booking):
        primary_contact = obj.phone or obj.email or "Waiting for details"
        secondary_contact = obj.email if obj.phone and obj.email else obj.get_preferred_contact_method_display()
        if secondary_contact:
            return format_html(
                "{}<span class=\"morent-subtext\">{}</span>",
                primary_contact,
                secondary_contact,
            )
        return primary_contact

    @admin.display(description="Rental window")
    def booking_window(self, obj: Booking):
        if not obj.start_date and not obj.end_date:
            return "Flexible enquiry"
        if obj.start_date and obj.end_date:
            return f"{obj.start_date} to {obj.end_date}"
        return obj.start_date or obj.end_date

    @admin.display(description="Source")
    def source_summary(self, obj: Booking):
        details = []

        if obj.source_context.get("locale"):
            details.append(obj.source_context["locale"])

        if obj.source_context.get("entry_point"):
            details.append(obj.source_context["entry_point"])

        if details:
            return format_html(
                "{}<span class=\"morent-subtext\">{}</span>",
                obj.source or "website",
                " / ".join(details),
            )

        return obj.source or "website"

    @admin.display(description="Source context")
    def source_context_pretty(self, obj: Booking):
        if not obj.source_context:
            return "No source context captured."

        return format_html(
            "<pre class=\"morent-code-block\">{}</pre>",
            json.dumps(obj.source_context, indent=2, ensure_ascii=False),
        )

    def render_badge(self, label: str, tone: str):
        return format_html(
            "<span class=\"morent-badge morent-badge--{}\">{}</span>",
            tone,
            label,
        )
