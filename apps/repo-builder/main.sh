#!/bin/bash

export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"
git clone "$GIT_REPOSITORY_URL" /home/app/output
echo "nameserver 8.8.8.8" | tee -a /etc/resolv.conf
exec node dist/index.js