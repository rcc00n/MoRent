from django.urls import path

from .views import SiteContactConfigAPIView

urlpatterns = [
    path("contact/", SiteContactConfigAPIView.as_view(), name="site-contact-config"),
]
