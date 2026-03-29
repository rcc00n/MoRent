#!/bin/sh
set -eu

TRIES=0
until [ -f /usr/share/nginx/html/index.html ] || [ "$TRIES" -ge 60 ]; do
  TRIES=$((TRIES + 1))
  sleep 1
done

exec nginx -g "daemon off;"
