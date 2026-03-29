import re

from rest_framework import serializers

from apps.cars.models import Car

from .models import Booking


def normalize_source_value(value: str) -> str:
    cleaned_value = re.sub(r"[^a-z0-9]+", "_", value.strip().lower())
    return cleaned_value.strip("_") or "website"


def normalize_context_value(value):
    if isinstance(value, dict):
        return {
            str(key).strip(): normalize_context_value(item)
            for key, item in value.items()
            if str(key).strip() and item not in (None, "")
        }

    if isinstance(value, list):
        return [normalize_context_value(item) for item in value if item not in (None, "")]

    if isinstance(value, str):
        return value.strip()

    return value


class BaseLeadSerializer(serializers.ModelSerializer):
    def validate_name(self, value: str) -> str:
        return value.strip()

    def validate_phone(self, value: str) -> str:
        return value.strip()

    def validate_email(self, value: str) -> str:
        return value.strip().lower()

    def validate_message(self, value: str) -> str:
        return value.strip()

    def validate_source(self, value: str) -> str:
        return normalize_source_value(value)

    def validate_source_context(self, value):
        if value in (None, ""):
            return {}

        if not isinstance(value, dict):
            raise serializers.ValidationError("Source context must be an object.")

        return normalize_context_value(value)

    def create(self, validated_data):
        validated_data.setdefault("status", Booking.LeadStatus.NEW)
        validated_data.setdefault("crm_sync_status", Booking.CrmSyncStatus.PENDING)
        return super().create(validated_data)


class BookingSerializer(BaseLeadSerializer):
    class Meta:
        model = Booking
        fields = (
            "id",
            "name",
            "phone",
            "email",
            "car",
            "start_date",
            "end_date",
            "request_type",
            "status",
            "preferred_contact_method",
            "source",
            "source_context",
            "crm_sync_status",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "request_type",
            "status",
            "crm_sync_status",
            "created_at",
            "updated_at",
        )

    def validate_car(self, value: Car) -> Car:
        if not value.available:
            raise serializers.ValidationError("Selected car is not available.")
        return value

    def validate(self, attrs):
        attrs["request_type"] = Booking.RequestType.BOOKING
        attrs["source"] = normalize_source_value(attrs.get("source", "website"))
        attrs["source_context"] = attrs.get("source_context", {})
        attrs["preferred_contact_method"] = (
            attrs.get("preferred_contact_method") or Booking.PreferredContactMethod.PHONE
        )

        if not attrs.get("phone"):
            raise serializers.ValidationError({"phone": "Phone is required."})

        if not attrs.get("car"):
            raise serializers.ValidationError({"car": "Car is required."})

        if not attrs.get("start_date"):
            raise serializers.ValidationError({"start_date": "Start date is required."})

        if not attrs.get("end_date"):
            raise serializers.ValidationError({"end_date": "End date is required."})

        if attrs["end_date"] <= attrs["start_date"]:
            raise serializers.ValidationError(
                {"end_date": "End date must be later than start date."}
            )
        return attrs


class ContactLeadSerializer(BaseLeadSerializer):
    request_type = serializers.ChoiceField(
        choices=(
            (Booking.RequestType.CONTACT, "Contact request"),
            (Booking.RequestType.SUPPORT, "Support request"),
        )
    )

    class Meta:
        model = Booking
        fields = (
            "id",
            "name",
            "phone",
            "email",
            "message",
            "request_type",
            "status",
            "preferred_contact_method",
            "source",
            "source_context",
            "crm_sync_status",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "status",
            "crm_sync_status",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        attrs["source"] = normalize_source_value(attrs.get("source", "contacts_page"))
        attrs["source_context"] = attrs.get("source_context", {})

        if not attrs.get("phone") and not attrs.get("email"):
            raise serializers.ValidationError(
                {"phone": "Phone or email is required.", "email": "Phone or email is required."}
            )

        if not attrs.get("message"):
            raise serializers.ValidationError({"message": "Message is required."})

        preferred_contact_method = attrs.get("preferred_contact_method") or ""

        if preferred_contact_method == Booking.PreferredContactMethod.EMAIL and not attrs.get(
            "email"
        ):
            raise serializers.ValidationError(
                {"preferred_contact_method": "An email address is required for email follow-up."}
            )

        if preferred_contact_method in (
            Booking.PreferredContactMethod.PHONE,
            Booking.PreferredContactMethod.WHATSAPP,
            Booking.PreferredContactMethod.TELEGRAM,
        ) and not attrs.get("phone"):
            raise serializers.ValidationError(
                {"preferred_contact_method": "A phone number is required for the selected contact method."}
            )

        return attrs
