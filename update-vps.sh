#!/bin/bash

# ==============================================
# Script de mise à jour - Mermaid Aquata
# Usage : bash update-vps.sh
# À lancer depuis n'importe quel répertoire
# ==============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

print_status()  { echo -e "${GREEN}[OK]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[ATTENTION]${NC} $1"; }
print_error()   { echo -e "${RED}[ERREUR]${NC} $1"; }
print_header()  { echo -e "\n${CYAN}==========================================\n  $1\n==========================================${NC}\n"; }

APP_DIR="/var/www/mermaid-aquata"
API_DIR="$APP_DIR/artifacts/api-server"
PM2_NAME="mermaid-aquata"

if [ ! -d "$APP_DIR" ]; then
    print_error "Répertoire $APP_DIR introuvable."
    exit 1
fi

print_header "Mise à jour Mermaid Aquata"

# ── Git pull ────────────────────────────────
print_header "Récupération des mises à jour"
cd "$APP_DIR"
git pull
print_status "Code mis à jour"

# ── Dépendances ─────────────────────────────
print_header "Vérification des dépendances"
pnpm install
print_status "Dépendances OK"

# ── Build API ───────────────────────────────
print_header "Build de l'API"
pnpm --filter @workspace/api-server run build
print_status "API compilée"

# ── Build Frontend ──────────────────────────
print_header "Build du frontend"
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/mermaid-tails run build
print_status "Frontend compilé"

# ── Redémarrage PM2 ─────────────────────────
print_header "Redémarrage de l'API"

if pm2 describe "$PM2_NAME" > /dev/null 2>&1; then
    pm2 restart "$PM2_NAME"
    print_status "API redémarrée"
else
    print_warning "PM2 process '$PM2_NAME' non trouvé, démarrage..."

    if [ ! -f "$API_DIR/.env" ]; then
        print_warning "Fichier .env manquant, création avec valeurs par défaut..."
        cat > "$API_DIR/.env" << EOF
NODE_ENV=production
PORT=8080
ADMIN_SECRET=mermaid-admin
SESSION_SECRET=$(openssl rand -hex 32)
EOF
        chmod 600 "$API_DIR/.env"
        print_status ".env créé"
    fi

    cat > "$API_DIR/start.sh" << 'STARTSCRIPT'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
set -a
source .env
set +a
exec node --enable-source-maps dist/index.mjs
STARTSCRIPT
    chmod +x "$API_DIR/start.sh"

    pm2 start "$API_DIR/start.sh" \
        --name "$PM2_NAME" \
        --cwd "$API_DIR"
    pm2 save
    print_status "API démarrée avec PM2"
fi

# ── Rechargement Nginx ──────────────────────
print_header "Rechargement Nginx"
if command -v nginx > /dev/null 2>&1; then
    nginx -t && systemctl reload nginx 2>/dev/null || sudo nginx -t && sudo systemctl reload nginx
    print_status "Nginx rechargé"
else
    print_warning "Nginx non trouvé, rechargement ignoré"
fi

# ── Résumé ──────────────────────────────────
print_header "Mise à jour terminée !"
echo "  Site      : vérifiez votre domaine"
echo "  API       : pm2 logs $PM2_NAME"
echo "  Statut    : pm2 status"
echo ""
pm2 status
