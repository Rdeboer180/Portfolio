#!/usr/bin/env bash
# Read-only diagnostics for this portfolio's host. No credentials, certificates,
# private keys, or unrelated virtual-host contents are printed.
set -u

id -un
command -v nginx || true
command -v certbot || true
if sudo -n true 2>/dev/null; then
  echo 'Hosting configuration administrator access: available'
else
  echo 'Hosting configuration administrator access: unavailable'
fi

for directory in /etc/nginx/sites-enabled /etc/nginx/sites-available /etc/nginx/conf.d; do
  if [ -r "$directory" ]; then
    grep -Rsl 'rdeboerdesigns\.com' "$directory" 2>/dev/null | while IFS= read -r config; do
      echo "Portfolio virtual host: $config"
      awk '/server_name|listen |return 30[18]|rewrite |proxy_redirect|proxy_set_header.*(Host|Proto)|include |ssl_certificate |root / { print }' "$config"
    done
  fi
done
