from django.urls import path

from .views import (
    FAQListAPIView,
    LegalPageContentAPIView,
    SiteContactConfigAPIView,
    SitePageContentAPIView,
    SiteSettingsAPIView,
)

urlpatterns = [
    path("contact/", SiteContactConfigAPIView.as_view(), name="site-contact-config"),
    path("settings/", SiteSettingsAPIView.as_view(), name="site-settings"),
    path("pages/<slug:page_key>/", SitePageContentAPIView.as_view(), name="site-page-content"),
    path("faqs/", FAQListAPIView.as_view(), name="site-faq-list"),
    path("legal/<slug:page_key>/", LegalPageContentAPIView.as_view(), name="site-legal-page"),
]
