from rest_framework import serializers

from apps.cars.models import Car

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = (
            "id",
            "name",
            "phone",
            "car",
            "start_date",
            "end_date",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

    def validate_name(self, value: str) -> str:
        return value.strip()

    def validate_phone(self, value: str) -> str:
        cleaned_value = value.strip()
        if not cleaned_value:
            raise serializers.ValidationError("Phone is required.")
        return cleaned_value

    def validate_car(self, value: Car) -> Car:
        if not value.available:
            raise serializers.ValidationError("Selected car is not available.")
        return value

    def validate(self, attrs):
        if attrs["end_date"] <= attrs["start_date"]:
            raise serializers.ValidationError(
                {"end_date": "End date must be later than start date."}
            )
        return attrs
