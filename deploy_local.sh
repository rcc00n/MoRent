#!/bin/sh
set -eu

ssh -i ~/.ssh/greencrm_agent -o StrictHostKeyChecking=no root@89.111.171.91 "cd /var/www/morent && ./deploy.sh"
