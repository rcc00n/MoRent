from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView


def build_phone_href(phone_number: str) -> str:
    normalized_number = "".join(
        character for character in phone_number if character.isdigit() or character == "+"
    )
    return f"tel:{normalized_number}" if normalized_number else ""


class SiteContactConfigAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        phone_number = settings.BUSINESS_CONTACT_PHONE
        email_address = settings.BUSINESS_CONTACT_EMAIL
        whatsapp_url = settings.BUSINESS_CONTACT_WHATSAPP_URL
        telegram_url = settings.BUSINESS_CONTACT_TELEGRAM_URL

        return Response(
            {
                "channels": {
                    "phone": {
                        "value": phone_number,
                        "href": build_phone_href(phone_number),
                    },
                    "email": {
                        "value": email_address,
                        "href": f"mailto:{email_address}" if email_address else "",
                    },
                    "whatsapp": {
                        "value": "WhatsApp" if whatsapp_url else "",
                        "href": whatsapp_url,
                    },
                    "telegram": {
                        "value": "Telegram" if telegram_url else "",
                        "href": telegram_url,
                    },
                },
                "service_hours": settings.BUSINESS_SERVICE_HOURS,
            }
        )
