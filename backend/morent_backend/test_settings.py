"""Isolated regression profile; not a development or production database."""
from .settings import *  # noqa: F403

DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': ':memory:'}}
SECRET_KEY = 'synthetic-test-only-not-a-deployment-secret'
ALLOWED_HOSTS = ['testserver', '127.0.0.1', 'localhost']
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
MEDIA_ROOT = os.environ['MORENT_TEST_MEDIA_ROOT']  # noqa: F405
