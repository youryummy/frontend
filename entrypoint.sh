#!/bin/sh

find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#PUBLIC_SCOPE_TEMP#$PUBLIC_SCOPE#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#CLIENT_ID_TEMP#$CLIENT_ID#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#CLIENT_SECRET_TEMP#$CLIENT_SECRET#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#REDIRECT_URI_TEMP#$REDIRECT_URI#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#BACKEND_URL_TEMP#$BACKEND_URL#g"

echo "Starting Nextjs"
exec "$@"