from django.contrib.admin.apps import AdminConfig


class MoRentAdminConfig(AdminConfig):
    default_site = "morent_backend.admin.MoRentAdminSite"
