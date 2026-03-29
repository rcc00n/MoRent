import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def split_csv_env(key: str, default: str) -> list[str]:
    return [item.strip() for item in os.getenv(key, default).split(",") if item.strip()]


SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "change-me-for-production")
DEBUG = os.getenv("DJANGO_DEBUG", "True").lower() == "true"

ALLOWED_HOSTS = split_csv_env(
    "DJANGO_ALLOWED_HOSTS",
    "127.0.0.1,localhost,morent82.duckdns.org,89.111.171.91",
)
CSRF_TRUSTED_ORIGINS = split_csv_env(
    "CSRF_TRUSTED_ORIGINS",
    "http://localhost:5173,https://morent82.duckdns.org",
)
CORS_ALLOWED_ORIGINS = split_csv_env(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,https://morent82.duckdns.org",
)


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "apps.cars",
    "apps.bookings",
    "apps.siteconfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "morent_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "morent_backend.wsgi.application"


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB", "morent"),
        "USER": os.getenv("POSTGRES_USER", "morent"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "morent"),
        "HOST": os.getenv("POSTGRES_HOST", "127.0.0.1"),
        "PORT": os.getenv("POSTGRES_PORT", "5433"),
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


LANGUAGE_CODE = "ru-ru"

TIME_ZONE = "Europe/Moscow"

USE_I18N = True

USE_TZ = True


STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}

BUSINESS_CONTACT_PHONE = os.getenv("BUSINESS_CONTACT_PHONE", "").strip()
BUSINESS_CONTACT_EMAIL = os.getenv("BUSINESS_CONTACT_EMAIL", "").strip()
BUSINESS_CONTACT_WHATSAPP_URL = os.getenv("BUSINESS_CONTACT_WHATSAPP_URL", "").strip()
BUSINESS_CONTACT_TELEGRAM_URL = os.getenv("BUSINESS_CONTACT_TELEGRAM_URL", "").strip()
BUSINESS_SERVICE_HOURS = os.getenv("BUSINESS_SERVICE_HOURS", "Daily, 08:00 to 22:00").strip()
