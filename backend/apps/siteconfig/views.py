from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    AboutPageContent,
    ContactsPageContent,
    FaqPageContent,
    HomePageContent,
    HowItWorksPageContent,
    LegalPageContent,
    ThankYouPageContent,
)
from .serializers import (
    AboutPageContentSerializer,
    ContactsPageContentSerializer,
    FAQItemSerializer,
    FaqPageContentSerializer,
    HomePageContentSerializer,
    HowItWorksPageContentSerializer,
    LegalPageContentSerializer,
    SiteSettingsSerializer,
    ThankYouPageContentSerializer,
)
from .utils import get_requested_language, get_site_settings


PAGE_SERIALIZER_MAP = {
    "home": (HomePageContent, HomePageContentSerializer),
    "about": (AboutPageContent, AboutPageContentSerializer),
    "contacts": (ContactsPageContent, ContactsPageContentSerializer),
    "faq": (FaqPageContent, FaqPageContentSerializer),
    "how-it-works": (HowItWorksPageContent, HowItWorksPageContentSerializer),
    "request-received": (ThankYouPageContent, ThankYouPageContentSerializer),
}


class PublicAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def serializer_context(self):
        return {
            "request": self.request,
            "language": get_requested_language(self.request),
        }


class SiteContactConfigAPIView(PublicAPIView):
    def get(self, request):
        serializer = SiteSettingsSerializer(
            get_site_settings(),
            context=self.serializer_context(),
        )
        site_settings = serializer.data
        return Response(
            {
                "channels": site_settings["channels"],
                "service_hours": site_settings["service_hours"],
            }
        )


class SiteSettingsAPIView(PublicAPIView):
    def get(self, request):
        serializer = SiteSettingsSerializer(
            get_site_settings(),
            context=self.serializer_context(),
        )
        return Response(serializer.data)


class SitePageContentAPIView(PublicAPIView):
    def get(self, request, page_key: str):
        page_config = PAGE_SERIALIZER_MAP.get(page_key)
        if not page_config:
            return Response({"detail": "Unknown page key."}, status=404)

        model_class, serializer_class = page_config
        page_content, _ = model_class.objects.get_or_create(pk=1)
        serializer = serializer_class(page_content, context=self.serializer_context())
        return Response(serializer.data)


class FAQListAPIView(PublicAPIView):
    def get(self, request):
        faq_page, _ = FaqPageContent.objects.get_or_create(pk=1)
        items = faq_page.items.filter(is_visible=True)
        serializer = FAQItemSerializer(
            items,
            many=True,
            context=self.serializer_context(),
        )
        return Response(serializer.data)


class LegalPageContentAPIView(PublicAPIView):
    def get(self, request, page_key: str):
        if page_key not in {
            LegalPageContent.PageKey.TERMS,
            LegalPageContent.PageKey.PRIVACY,
        }:
            return Response({"detail": "Unknown legal page key."}, status=404)

        legal_page, _ = LegalPageContent.objects.get_or_create(page_key=page_key)
        serializer = LegalPageContentSerializer(
            legal_page,
            context=self.serializer_context(),
        )
        return Response(serializer.data)
