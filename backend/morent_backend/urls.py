from django.contrib import admin
from django.urls import include, path

from apps.bookings.views import ContactLeadCreateAPIView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/cars/", include("apps.cars.urls")),
    path("api/bookings/", include("apps.bookings.urls")),
    path("api/contact-requests/", ContactLeadCreateAPIView.as_view(), name="contact-request-create"),
    path("api/site-config/", include("apps.siteconfig.urls")),
]
