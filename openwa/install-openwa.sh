#!/usr/bin/env bash
# =============================================================================
# OpenWA production install for Ubuntu 22.04 / 24.04
#   Domain : wa.hipxpert.in  (A record -> this server)
#   Stack  : Docker (official GHCR image, pinned) + nginx reverse proxy + Let's Encrypt
# Run as root:  bash install-openwa.sh
# Safe to re-run: existing secrets and data are kept.
# =============================================================================
set -euo pipefail

DOMAIN="wa.hipxpert.in"
OPENWA_VERSION="0.9.0"            # git tag v0.9.0 / image ghcr.io/rmyndharis/openwa:0.9.0
LE_EMAIL=""                       # optional: your email for certificate-expiry notices
INSTALL_DIR="/opt/openwa"
SECRETS_FILE="/root/openwa-secrets.txt"

log() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "Run as root."
. /etc/os-release
[[ "$ID" == "ubuntu" ]] || die "This script targets Ubuntu (found: $ID)."

# ----------------------------------------------------------------------------- 1. OS
log "Updating the system and installing base packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get -o Dpkg::Options::="--force-confold" upgrade -y
apt-get install -y ca-certificates curl git gnupg openssl ufw fail2ban \
  unattended-upgrades nginx certbot python3-certbot-nginx dnsutils
dpkg-reconfigure -f noninteractive unattended-upgrades   # automatic security updates

# ----------------------------------------------------------------------------- 2. Swap
if ! swapon --show | grep -q .; then
  log "Creating a 4G swap file (Chromium sessions spike memory at startup)"
  fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl -w vm.swappiness=10 >/dev/null
  echo 'vm.swappiness=10' > /etc/sysctl.d/99-openwa.conf
fi

# ----------------------------------------------------------------------------- 3. Firewall
log "Configuring the firewall (SSH, HTTP, HTTPS only)"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
systemctl enable --now fail2ban      # bans IPs that brute-force SSH

# ----------------------------------------------------------------------------- 4. Docker
if ! command -v docker >/dev/null; then
  log "Installing Docker Engine"
  curl -fsSL https://get.docker.com | sh
fi
cat > /etc/docker/daemon.json <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "20m", "max-file": "5" },
  "live-restore": true
}
EOF
systemctl enable docker
systemctl restart docker

# ----------------------------------------------------------------------------- 5. OpenWA source (compose files)
log "Fetching OpenWA v${OPENWA_VERSION}"
if [[ ! -d "$INSTALL_DIR/.git" ]]; then
  git clone https://github.com/rmyndharis/OpenWA.git "$INSTALL_DIR"
fi
git -C "$INSTALL_DIR" fetch --tags --force
git -C "$INSTALL_DIR" checkout -q "v${OPENWA_VERSION}"
cd "$INSTALL_DIR"

# ----------------------------------------------------------------------------- 6. .env + secrets
TOTAL_MB=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)
MEM_LIMIT_MB=$(( TOTAL_MB - 768 )); (( MEM_LIMIT_MB < 1536 )) && MEM_LIMIT_MB=1536

if [[ ! -f .env ]]; then
  log "Generating secrets and .env"
  API_MASTER_KEY=$(openssl rand -hex 32)      # 64 chars (production requires >= 32)
  API_KEY_PEPPER=$(openssl rand -hex 32)
  umask 077
  cat > .env <<EOF
# ---- OpenWA production config (generated $(date -u +%F)) ----
NODE_ENV=production
TZ=UTC
API_MASTER_KEY=${API_MASTER_KEY}
API_KEY_PEPPER=${API_KEY_PEPPER}

BASE_URL=https://${DOMAIN}
DASHBOARD_URL=https://${DOMAIN}
CORS_ORIGINS=https://${DOMAIN}
# nginx reaches the container through Docker's bridge gateway
TRUSTED_PROXIES=172.16.0.0/12

# Multiple numbers
AUTO_START_SESSIONS=true
MAX_CONCURRENT_SESSIONS=0
OPENWA_MEM_LIMIT=${MEM_LIMIT_MB}m
OPENWA_PIDS_LIMIT=4096
# ENGINE_TYPE=baileys   # uncomment for low RAM use per number (higher ban risk)

LOG_LEVEL=info
EOF
  umask 022
  cat > "$SECRETS_FILE" <<EOF
OpenWA secrets - generated $(date -u)
Dashboard / API URL : https://${DOMAIN}
Admin API key       : ${API_MASTER_KEY}
(API_KEY_PEPPER is in ${INSTALL_DIR}/.env - never change it, or all API keys stop working)
EOF
  chmod 600 "$SECRETS_FILE" .env
else
  log ".env already exists - keeping existing secrets"
fi

# Pin the official image and turn off the Docker-socket sidecar. It is only needed for
# dashboard-managed Postgres/Redis/MinIO; without it the app container has no path to the Docker daemon.
cat > docker-compose.override.yml <<EOF
services:
  openwa-api:
    image: ghcr.io/rmyndharis/openwa:${OPENWA_VERSION}
    pull_policy: missing
    # v0.9.0's compose file has no env_file and does not forward these, so pass them through here
    environment:
      - API_KEY_PEPPER=\${API_KEY_PEPPER:-}
      - BASE_URL=\${BASE_URL:-}
      - DASHBOARD_URL=\${DASHBOARD_URL:-}
      - CORS_ORIGINS=\${CORS_ORIGINS:-}
      - AUTO_START_SESSIONS=\${AUTO_START_SESSIONS:-}
      - MAX_CONCURRENT_SESSIONS=\${MAX_CONCURRENT_SESSIONS:-0}
      - TZ=\${TZ:-UTC}
    # drop the docker-proxy dependency (sidecar disabled below); keep the optional datastores
    depends_on: !override
      postgres:
        condition: service_healthy
        required: false
      redis:
        condition: service_healthy
        required: false
  docker-proxy:
    profiles: ['disabled']
EOF

# ----------------------------------------------------------------------------- 7. Start OpenWA
log "Pulling and starting OpenWA"
docker compose pull openwa-api
docker compose up -d --no-build --remove-orphans

log "Waiting for OpenWA to become ready"
for i in $(seq 1 60); do
  if curl -fsS http://127.0.0.1:2785/api/health/ready >/dev/null 2>&1; then echo "ready"; break; fi
  sleep 5
  [[ $i -eq 60 ]] && { docker compose logs --tail=80 openwa-api; die "OpenWA did not become ready."; }
done

# ----------------------------------------------------------------------------- 8. nginx
log "Configuring nginx for ${DOMAIN}"
cat > /etc/nginx/conf.d/00-websocket-map.conf <<'EOF'
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
EOF
sed -i 's/# *server_tokens off;/server_tokens off;/' /etc/nginx/nginx.conf

cat > /etc/nginx/sites-available/openwa <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    client_max_body_size 30m;          # OpenWA accepts 25 MB bodies (base64 media)

    location / {
        proxy_pass http://127.0.0.1:2785;
        proxy_http_version 1.1;
        proxy_set_header Upgrade           \$http_upgrade;
        proxy_set_header Connection        \$connection_upgrade;
        proxy_set_header Host              \$host;
        proxy_set_header X-Real-IP         \$remote_addr;
        proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout  300s;
        proxy_send_timeout  300s;
        proxy_buffering off;           # live events / Socket.IO
    }
}
EOF
ln -sf /etc/nginx/sites-available/openwa /etc/nginx/sites-enabled/openwa
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ----------------------------------------------------------------------------- 9. SSL
log "Getting a Let's Encrypt certificate"
SERVER_IP=$(curl -4 -fsS https://api.ipify.org || true)
DNS_IP=$(dig +short A "$DOMAIN" | tail -1)
[[ -n "$SERVER_IP" && "$DNS_IP" != "$SERVER_IP" ]] && \
  echo "WARNING: ${DOMAIN} resolves to ${DNS_IP}, this server is ${SERVER_IP}."
if [[ -n "$LE_EMAIL" ]]; then EMAIL_ARG=(--email "$LE_EMAIL"); else EMAIL_ARG=(--register-unsafely-without-email); fi
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos "${EMAIL_ARG[@]}" --redirect --hsts
systemctl enable --now certbot.timer    # auto-renewal
certbot renew --dry-run

# ----------------------------------------------------------------------------- 10. Daily backups
log "Setting up daily backups (kept 7 days in /var/backups/openwa)"
mkdir -p /var/backups/openwa && chmod 700 /var/backups/openwa
cat > /etc/cron.daily/openwa-backup <<'EOF'
#!/bin/sh
# Backs up session logins, the database and API keys (volume openwa_openwa-data) plus .env
set -e
D=/var/backups/openwa; T=$(date +%F)
docker run --rm -v openwa_openwa-data:/data:ro -v "$D":/backup alpine \
  tar czf "/backup/openwa-data-$T.tgz" -C /data .
cp /opt/openwa/.env "$D/env-$T"
chmod 600 "$D"/*
find "$D" -type f -mtime +7 -delete
EOF
chmod 755 /etc/cron.daily/openwa-backup

# ----------------------------------------------------------------------------- Done
log "Checking the public endpoint"
curl -fsS "https://${DOMAIN}/api/health/ready" && echo

log "OpenWA is installed"
cat "$SECRETS_FILE"
cat <<EOF

Next steps:
  1. Open https://${DOMAIN} and sign in with the Admin API key above.
  2. Add one session per WhatsApp number, then scan each QR code
     (phone: Settings > Linked devices > Link a device).
  3. Create separate operator keys per app/number instead of sharing the admin key.

Useful commands (run in ${INSTALL_DIR}):
  docker compose logs -f openwa-api     # logs
  docker compose restart openwa-api     # restart
  cat ${SECRETS_FILE}                   # show the admin key again
EOF
