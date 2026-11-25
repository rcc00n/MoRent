"""Run backend checks with temporary files and no external database/provider."""
import os
from pathlib import Path
import socket
import sys
import tempfile

root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root / 'backend'))
os.environ['DJANGO_SETTINGS_MODULE'] = 'morent_backend.test_settings'


def blocked(*args, **kwargs):
    raise RuntimeError('Network is forbidden in the isolated regression suite')


socket.socket.connect = blocked
socket.socket.connect_ex = blocked
socket.create_connection = blocked
with tempfile.TemporaryDirectory(prefix='morent-tests-') as media:
    os.environ['MORENT_TEST_MEDIA_ROOT'] = media
    from django.core.management import execute_from_command_line
    args = sys.argv[1:] or ['test', 'apps.cars', 'apps.bookings', 'apps.siteconfig']
    execute_from_command_line(['manage.py', *args])
