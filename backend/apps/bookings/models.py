from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.cars.models import Car


class Booking(models.Model):
    class RequestType(models.TextChoices):
        BOOKING = "booking_request", _("Booking request")
        CONTACT = "contact_request", _("Contact request")
        SUPPORT = "support_request", _("Support request")

    class LeadStatus(models.TextChoices):
        NEW = "new", _("New")
        REVIEWING = "reviewing", _("Reviewing")
        CONTACTED = "contacted", _("Contacted")
        CLOSED = "closed", _("Closed")

    class PreferredContactMethod(models.TextChoices):
        PHONE = "phone", _("Phone")
        EMAIL = "email", _("Email")
        WHATSAPP = "whatsapp", _("WhatsApp")
        TELEGRAM = "telegram", _("Telegram")

    class CrmSyncStatus(models.TextChoices):
        PENDING = "pending", _("Pending")
        SYNCED = "synced", _("Synced")
        FAILED = "failed", _("Failed")
        SKIPPED = "skipped", _("Skipped")

    name = models.CharField(max_length=255, help_text=_("Primary customer or lead name."))
    phone = models.CharField(
        max_length=50,
        blank=True,
        help_text=_("Phone number used for direct follow-up."),
    )
    email = models.EmailField(
        blank=True,
        help_text=_("Optional email for consultation or support follow-up."),
    )
    message = models.TextField(
        blank=True,
        help_text=_("Free-form enquiry or support context from the site."),
    )
    preferred_contact_method = models.CharField(
        max_length=32,
        blank=True,
        choices=PreferredContactMethod.choices,
        help_text=_("Preferred callback channel when one is provided."),
    )
    car = models.ForeignKey(
        Car,
        on_delete=models.PROTECT,
        related_name="bookings",
        null=True,
        blank=True,
        help_text=_("Requested vehicle when the lead is a booking enquiry."),
    )
    start_date = models.DateField(
        null=True,
        blank=True,
        help_text=_("Requested pickup date for booking enquiries."),
    )
    end_date = models.DateField(
        null=True,
        blank=True,
        help_text=_("Requested return date for booking enquiries."),
    )
    request_type = models.CharField(
        max_length=32,
        choices=RequestType.choices,
        default=RequestType.BOOKING,
        db_index=True,
        help_text=_("Classifies the incoming lead intent."),
    )
    status = models.CharField(
        max_length=32,
        choices=LeadStatus.choices,
        default=LeadStatus.NEW,
        db_index=True,
        help_text=_("Internal operator status for the lead."),
    )
    source = models.CharField(
        max_length=100,
        blank=True,
        default="website",
        db_index=True,
        help_text=_("Normalized entry source for attribution and CRM mapping."),
    )
    source_context = models.JSONField(
        blank=True,
        default=dict,
        help_text=_("Structured page, locale, and entry-point metadata from the frontend."),
    )
    crm_sync_status = models.CharField(
        max_length=32,
        choices=CrmSyncStatus.choices,
        default=CrmSyncStatus.PENDING,
        db_index=True,
        help_text=_("Current CRM synchronization state."),
    )
    crm_external_id = models.CharField(
        max_length=255,
        blank=True,
        help_text=_("External CRM lead or deal identifier."),
    )
    crm_last_synced_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text=_("Last successful or attempted CRM sync timestamp."),
    )
    crm_sync_error = models.TextField(
        blank=True,
        help_text=_("Last CRM sync error payload or operator note."),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["request_type", "status"]),
            models.Index(fields=["crm_sync_status", "created_at"]),
            models.Index(fields=["source", "created_at"]),
        ]
        verbose_name = _("Lead request")
        verbose_name_plural = _("Lead requests")

    def __str__(self) -> str:
        if self.car_id:
            return f"{self.name} — {self.car}"

        return f"{self.name} — {self.get_request_type_display()}"
