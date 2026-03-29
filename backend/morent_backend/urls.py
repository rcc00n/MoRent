from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/cars/", include("apps.cars.urls")),
    path("api/bookings/", include("apps.bookings.urls")),
]
