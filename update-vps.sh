#!/bin/bash

# ==============================================
# Script de mise à jour - Mermaid Aquata
# Usage : bash update-vps.sh
# Préserve les données et images du serveur
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
BACKUP_DIR="/tmp/mermaid-aquata-backup-$(date +%Y%m%d_%H%M%S)"

if [ ! -d "$APP_DIR" ]; then
    print_error "Répertoire $APP_DIR introuvable."
    exit 1
fi

print_header "Mise à jour Mermaid Aquata"
echo "Les données (images, catalogue, avis...) du serveur seront préservées."
echo ""

# ── Sauvegarde des données locales ──────────
print_header "Sauvegarde des données du serveur"

mkdir -p "$BACKUP_DIR"

if [ -d "$API_DIR/uploads" ]; then
    cp -r "$API_DIR/uploads" "$BACKUP_DIR/uploads"
    print_status "Images sauvegardées ($(ls "$API_DIR/uploads" | wc -l) fichiers)"
fi

if [ -d "$API_DIR/data" ]; then
    cp -r "$API_DIR/data" "$BACKUP_DIR/data"
    print_status "Données JSON sauvegardées"
fi

if [ -f "$API_DIR/.env" ]; then
    cp "$API_DIR/.env" "$BACKUP_DIR/.env"
    print_status ".env sauvegardé"
fi

# ── Git pull (code uniquement) ──────────────
print_header "Récupération du code mis à jour"
cd "$APP_DIR"

# Force la mise à jour sans se bloquer sur les modifications locales
# (les données ont déjà été sauvegardées ci-dessus)
git fetch origin
git reset --hard origin/main
print_status "Code mis à jour"

# ── Restauration des données locales ────────
print_header "Restauration des données du serveur"

if [ -d "$BACKUP_DIR/uploads" ]; then
    rm -rf "$API_DIR/uploads"
    cp -r "$BACKUP_DIR/uploads" "$API_DIR/uploads"
    print_status "Images restaurées ($(ls "$API_DIR/uploads" | wc -l) fichiers)"
fi

if [ -d "$BACKUP_DIR/data" ]; then
    rm -rf "$API_DIR/data"
    cp -r "$BACKUP_DIR/data" "$API_DIR/data"
    print_status "Données JSON restaurées"
fi

if [ -f "$BACKUP_DIR/.env" ]; then
    cp "$BACKUP_DIR/.env" "$API_DIR/.env"
    chmod 600 "$API_DIR/.env"
    print_status ".env restauré"
fi

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

# ── Traductions automatiques ────────────────
print_header "Application des traductions"
echo "Attente du démarrage de l'API..."
sleep 8
ADMIN_SECRET_VAL=$(grep ADMIN_SECRET "$API_DIR/.env" 2>/dev/null | cut -d= -f2 || echo "mermaid-admin")
curl -s -X POST "http://localhost:8080/api/admin/translate-all" \
  -H "x-admin-token: ${ADMIN_SECRET_VAL}" \
  -H "Content-Type: application/json" | python3 -c "import sys,json; r=json.load(sys.stdin); print(f'  Catalogue: {r[\"catalogue\"]} articles | Avis: {r[\"remerciements\"]} | Erreurs: {len(r[\"errors\"])}')" 2>/dev/null \
  && print_status "Traductions appliquées" \
  || print_warning "Traduction auto échouée (relancer depuis panneau admin)"

# ── Rechargement Nginx ──────────────────────
if command -v nginx > /dev/null 2>&1; then
    nginx -t 2>/dev/null && systemctl reload nginx 2>/dev/null || \
    sudo nginx -t && sudo systemctl reload nginx
    print_status "Nginx rechargé"
fi

# ── Nettoyage backup ────────────────────────
rm -rf "$BACKUP_DIR"

# ── Résumé ──────────────────────────────────
print_header "Mise à jour terminée !"
echo "  Images    : conservées depuis le serveur"
echo "  Données   : conservées depuis le serveur"
echo "  Code      : mis à jour depuis git"
echo ""
pm2 status
