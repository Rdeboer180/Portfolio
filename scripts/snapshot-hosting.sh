#!/usr/bin/env bash
# Read-only record of the portfolio's host, for restoring or comparing after a
# server change (the PHP 8.4 upgrade, October 2026). Run by
# .github/workflows/snapshot-hosting.yml with the docroot as $1.
#
# The repository is public and its workflow artifacts can be downloaded by any
# signed-in GitHub user, so this prints nothing private: no keys,
# certificates, secrets, passwords, cron jobs or logs, and IP addresses in the
# Varnish config are blanked. The site's own files are public already.
set -u
docroot="${1:-}"
redact_ips() { sed -E 's/[0-9]{1,3}(\.[0-9]{1,3}){3}/<ip>/g'; }
section() { printf '\n===== %s =====\n' "$1"; }

section 'Captured'
date -u '+%Y-%m-%dT%H:%M:%SZ'
uname -srm

section 'Versions'
command -v php >/dev/null && php -v | head -1 || echo 'php: not on PATH'
command -v nginx >/dev/null && nginx -v 2>&1 || echo 'nginx: not on PATH'
command -v varnishd >/dev/null && varnishd -V 2>&1 | head -1 || echo 'varnishd: not on PATH'
ls -d /etc/php/*/ 2>/dev/null | sed 's#/etc/php/##; s#/##' | tr '\n' ' '; echo '(installed PHP versions under /etc/php)'
systemctl list-units --type=service --no-legend 2>/dev/null | awk '/php.*fpm|nginx|varnish/ { print $1, $3, $4 }'

section 'PHP extensions'
command -v php >/dev/null && php -m 2>/dev/null | tr '\n' ' ' && echo

section 'Sites and whether they hand requests to PHP'
for f in /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*.conf; do
  [ -r "$f" ] || continue
  names=$(awk '/server_name/ { $1=""; gsub(";", ""); printf "%s", $0 }' "$f")
  if grep -qs 'fastcgi_pass\|php' "$f"; then php='uses PHP'; else php='no PHP'; fi
  echo "$(basename "$f"): $php:$names"
done

section 'Portfolio virtual host (serving directives only)'
for f in /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*.conf; do
  [ -r "$f" ] || continue
  grep -qs 'rdeboerdesigns\.com' "$f" || continue
  echo "# $f"
  grep -E '^\s*(server_name|listen|root|index|location|try_files|gzip|brotli|expires|add_header|error_page|return|rewrite|include|proxy_pass|fastcgi_pass|\})' "$f" | redact_ips
done

section 'Varnish config (IP addresses blanked)'
for f in /etc/varnish/default.vcl; do [ -r "$f" ] && redact_ips < "$f" || echo "$f: not readable"; done

section 'Docroot'
if [ -n "$docroot" ] && [ -d "$docroot" ]; then
  echo "files: $(find "$docroot" -type f | wc -l)  size: $(du -sh "$docroot" | cut -f1)"
  (cd "$docroot" && find . -maxdepth 1 | sort | head -60)
else
  echo 'docroot not given or not found'
fi
