#!/bin/sh
set -eu

cd /var/www/morent

if [ -f ./.env ]; then
  set -a
  . ./.env
  set +a
fi

git pull origin master
docker-compose -p morent -f infra/docker-compose.yml down --remove-orphans
docker-compose -p morent -f infra/docker-compose.yml up -d --build
