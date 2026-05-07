#!/bin/bash

# ==============================================
# Script d'installation VPS - Mermaid Aquata
# Stack : pnpm monorepo, Node.js/Express, Nginx
# Pas de base de données (JSON + uploads)
# Compatible Debian/Ubuntu/CentOS/Rocky/AlmaLinux
# ==============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[ATTENTION]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_header() {
    echo ""
    echo -e "${CYAN}=========================================="
    echo "  $1"
    echo -e "==========================================${NC}"
    echo ""
}

# ==========================================
# DÉTECTION DE LA DISTRIBUTION
# ==========================================

detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        DISTRO_ID="$ID"
        DISTRO_VERSION="$VERSION_ID"
        DISTRO_NAME="$PRETTY_NAME"
    elif [ -f /etc/redhat-release ]; then
        DISTRO_ID="rhel"
        DISTRO_NAME=$(cat /etc/redhat-release)
    else
        DISTRO_ID="unknown"
        DISTRO_NAME="Unknown"
    fi

    case "$DISTRO_ID" in
        ubuntu|debian)
            PKG_MANAGER="apt"
            PKG_UPDATE="apt update"
            PKG_UPGRADE="apt upgrade -y"
            PKG_INSTALL="apt install -y"
            FIREWALL_PKG="ufw"
            FIREWALL_CMD="ufw"
            SERVICE_CMD="systemctl"
            ;;
        centos|rhel|rocky|almalinux|fedora)
            if command -v dnf &> /dev/null; then
                PKG_MANAGER="dnf"
                PKG_UPDATE="dnf check-update || true"
                PKG_UPGRADE="dnf upgrade -y"
                PKG_INSTALL="dnf install -y"
            else
                PKG_MANAGER="yum"
                PKG_UPDATE="yum check-update || true"
                PKG_UPGRADE="yum upgrade -y"
                PKG_INSTALL="yum install -y"
            fi
            FIREWALL_PKG="firewalld"
            FIREWALL_CMD="firewall-cmd"
            SERVICE_CMD="systemctl"
            ;;
        *)
            print_error "Distribution non supportée : $DISTRO_NAME"
            print_info "Distributions supportées : Debian, Ubuntu, CentOS, Rocky Linux, AlmaLinux, Fedora"
            exit 1
            ;;
    esac

    print_info "Distribution détectée : $DISTRO_NAME"
    print_info "Gestionnaire de paquets : $PKG_MANAGER"
}

detect_distro

# Détection root
if [ "$EUID" -eq 0 ]; then
    print_warning "Exécution en tant que root détectée"
    print_info "Il est recommandé d'utiliser un utilisateur non-root avec sudo"
    read -p "Continuer en tant que root ? (o/N): " CONTINUE_AS_ROOT
    if [[ ! "$CONTINUE_AS_ROOT" =~ ^[oOyY]$ ]]; then
        if [ "$PKG_MANAGER" = "apt" ]; then
            echo "Créez un utilisateur avec : adduser monuser && usermod -aG sudo monuser"
        else
            echo "Créez un utilisateur avec : useradd monuser && passwd monuser && usermod -aG wheel monuser"
        fi
        exit 0
    fi
    RUN_AS_ROOT=true
else
    RUN_AS_ROOT=false
fi

print_header "Installation VPS - Mermaid Aquata"

echo -e "${BLUE}Ce script va installer et configurer :${NC}"
echo "  - Préparation système ($DISTRO_NAME)"
echo "  - Firewall ($FIREWALL_PKG)"
echo "  - Fail2ban (protection SSH)"
echo "  - Node.js 20 LTS"
echo "  - pnpm (gestionnaire de paquets)"
echo "  - Nginx (reverse proxy + fichiers statiques)"
echo "  - PM2 (gestionnaire de processus)"
echo "  - Certificat SSL (Let's Encrypt)"
echo ""

# Fonction pour exécuter avec ou sans sudo
run_cmd() {
    if [ "$RUN_AS_ROOT" = true ]; then
        "$@"
    else
        sudo "$@"
    fi
}

# Fonction pour installer des paquets (multi-distro)
pkg_install() {
    run_cmd $PKG_INSTALL "$@"
}

# Fonction pour activer et démarrer un service
enable_service() {
    run_cmd $SERVICE_CMD enable "$1"
    run_cmd $SERVICE_CMD start "$1"
}

# ==========================================
# PRÉPARATION SYSTÈME
# ==========================================

print_header "Préparation du système"

read -p "Configurer la préparation système (firewall, fail2ban, swap) ? (O/n): " DO_SYSTEM_PREP
DO_SYSTEM_PREP=${DO_SYSTEM_PREP:-O}

if [[ ! "$DO_SYSTEM_PREP" =~ ^[nN]$ ]]; then
    echo ""
    read -p "Timezone [Europe/Paris]: " TIMEZONE
    TIMEZONE=${TIMEZONE:-Europe/Paris}

    read -p "Créer un fichier swap ? (O/n): " CREATE_SWAP
    CREATE_SWAP=${CREATE_SWAP:-O}
    if [[ ! "$CREATE_SWAP" =~ ^[nN]$ ]]; then
        read -p "Taille du swap en GB [2]: " SWAP_SIZE
        SWAP_SIZE=${SWAP_SIZE:-2}
    fi
fi

# ==========================================
# CONFIGURATION INTERACTIVE
# ==========================================

print_header "Configuration de l'application"

read -p "Nom de l'application (ex: mermaid-aquata) : " APP_NAME
while [ -z "$APP_NAME" ]; do
    print_error "Le nom de l'application est obligatoire"
    read -p "Nom de l'application : " APP_NAME
done
APP_NAME=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')

DEFAULT_DIR="/var/www/$APP_NAME"
read -p "Répertoire d'installation [$DEFAULT_DIR]: " APP_DIR
APP_DIR=${APP_DIR:-$DEFAULT_DIR}

read -p "Nom de domaine (ex: mermaid-aquata.fr) : " DOMAIN
while [ -z "$DOMAIN" ]; do
    print_error "Le nom de domaine est obligatoire"
    read -p "Nom de domaine : " DOMAIN
done

read -p "Inclure www.$DOMAIN ? (O/n): " INCLUDE_WWW
INCLUDE_WWW=${INCLUDE_WWW:-O}

# Port de l'API (fixé à 8080 pour ce projet)
API_PORT=8080
print_info "Port API : $API_PORT (fixé pour ce projet)"

# ==========================================
# CONFIGURATION GIT
# ==========================================

print_header "Configuration Git"

echo "Méthodes de connexion Git :"
echo "  1) HTTPS (simple, avec token)"
echo "  2) SSH (recommandé pour les déploiements)"
echo "  3) Dépôt déjà cloné"
read -p "Choix [1]: " GIT_METHOD
GIT_METHOD=${GIT_METHOD:-1}

case $GIT_METHOD in
    1)
        read -p "URL HTTPS du dépôt (ex: https://github.com/user/repo.git) : " GIT_URL
        if [ -n "$GIT_URL" ]; then
            read -p "Token d'accès GitHub/GitLab (laisser vide si public) : " GIT_TOKEN
            read -p "Branche [main]: " GIT_BRANCH
            GIT_BRANCH=${GIT_BRANCH:-main}
            GIT_TYPE="https"
        fi
        ;;
    2)
        read -p "URL SSH du dépôt (ex: git@github.com:user/repo.git) : " GIT_URL
        read -p "Branche [main]: " GIT_BRANCH
        GIT_BRANCH=${GIT_BRANCH:-main}
        GIT_TYPE="ssh"
        SETUP_SSH_KEY=true
        ;;
    3)
        GIT_URL=""
        print_info "Assurez-vous que le dépôt est déjà cloné dans le répertoire cible"
        ;;
esac

read -p "Nom Git (pour les commits) : " GIT_USER_NAME
read -p "Email Git : " GIT_USER_EMAIL

# ==========================================
# CONFIGURATION SECRETS
# ==========================================

print_header "Configuration des secrets"

read -p "Mot de passe admin du site [mermaid-admin]: " ADMIN_SECRET
ADMIN_SECRET=${ADMIN_SECRET:-mermaid-admin}

# Variables d'environnement supplémentaires
read -p "Ajouter d'autres variables d'environnement ? (o/N): " ADD_EXTRA_ENV
EXTRA_ENV=""
if [[ "$ADD_EXTRA_ENV" =~ ^[oOyY]$ ]]; then
    echo "Entrez les variables au format NOM=valeur (ligne vide pour terminer) :"
    while true; do
        read -p "> " ENV_LINE
        if [ -z "$ENV_LINE" ]; then
            break
        fi
        EXTRA_ENV="$EXTRA_ENV$ENV_LINE\n"
    done
fi

# ==========================================
# RÉCAPITULATIF
# ==========================================

print_header "Récapitulatif de la configuration"

echo -e "${BLUE}Système :${NC}"
echo "  Distribution   : $DISTRO_NAME"
if [[ ! "$DO_SYSTEM_PREP" =~ ^[nN]$ ]]; then
    echo "  Préparation    : Oui ($FIREWALL_PKG, Fail2ban, Swap)"
    echo "  Timezone       : $TIMEZONE"
    if [[ ! "$CREATE_SWAP" =~ ^[nN]$ ]]; then
        echo "  Swap           : ${SWAP_SIZE}GB"
    fi
else
    echo "  Préparation    : Non"
fi
echo ""

echo -e "${BLUE}Application :${NC}"
echo "  Nom            : $APP_NAME"
echo "  Répertoire     : $APP_DIR"
echo "  Domaine        : $DOMAIN"
if [[ "$INCLUDE_WWW" =~ ^[oOyY]$ ]]; then
    echo "                   www.$DOMAIN"
fi
echo "  Port API       : $API_PORT"
echo "  Frontend       : $APP_DIR/artifacts/mermaid-tails/dist/ (statique)"
echo ""

echo -e "${BLUE}Git :${NC}"
if [ -n "$GIT_URL" ]; then
    echo "  Dépôt          : $GIT_URL"
    echo "  Branche        : $GIT_BRANCH"
    echo "  Méthode        : $GIT_TYPE"
else
    echo "  Dépôt          : (déjà cloné)"
fi
if [ -n "$GIT_USER_NAME" ]; then
    echo "  Utilisateur    : $GIT_USER_NAME <$GIT_USER_EMAIL>"
fi
echo ""

echo -e "${BLUE}Secrets :${NC}"
echo "  ADMIN_SECRET   : (défini)"
echo "  SESSION_SECRET : (généré automatiquement)"
echo ""

read -p "Continuer l'installation ? (O/n): " CONFIRM
if [[ "$CONFIRM" =~ ^[nN]$ ]]; then
    echo "Installation annulée."
    exit 0
fi

# ==========================================
# INSTALLATION DES DÉPENDANCES SYSTÈME
# ==========================================

print_header "Installation des dépendances système"

echo ">>> Mise à jour du système..."
run_cmd $PKG_UPDATE
run_cmd $PKG_UPGRADE
print_status "Système mis à jour"

echo ">>> Installation des outils de base..."
if [ "$PKG_MANAGER" = "apt" ]; then
    pkg_install curl wget git build-essential unzip htop
else
    pkg_install curl wget git gcc gcc-c++ make unzip htop
    pkg_install epel-release || true
fi
print_status "Outils de base installés"

# ==========================================
# PRÉPARATION SYSTÈME (SI DEMANDÉE)
# ==========================================

if [[ ! "$DO_SYSTEM_PREP" =~ ^[nN]$ ]]; then
    print_header "Configuration système"

    echo ">>> Configuration du fuseau horaire..."
    run_cmd timedatectl set-timezone "$TIMEZONE"
    print_status "Timezone configuré : $TIMEZONE"

    if [[ ! "$CREATE_SWAP" =~ ^[nN]$ ]]; then
        if [ ! -f /swapfile ]; then
            echo ">>> Création du fichier swap (${SWAP_SIZE}GB)..."
            run_cmd fallocate -l ${SWAP_SIZE}G /swapfile 2>/dev/null || run_cmd dd if=/dev/zero of=/swapfile bs=1G count=${SWAP_SIZE}
            run_cmd chmod 600 /swapfile
            run_cmd mkswap /swapfile
            run_cmd swapon /swapfile
            echo '/swapfile none swap sw 0 0' | run_cmd tee -a /etc/fstab
            print_status "Swap créé : ${SWAP_SIZE}GB"
        else
            print_status "Swap déjà configuré"
        fi
    fi

    echo ">>> Configuration du firewall ($FIREWALL_PKG)..."
    if [ "$PKG_MANAGER" = "apt" ]; then
        pkg_install ufw
        run_cmd ufw default deny incoming
        run_cmd ufw default allow outgoing
        run_cmd ufw allow ssh
        run_cmd ufw allow http
        run_cmd ufw allow https
        run_cmd ufw --force enable
    else
        pkg_install firewalld
        enable_service firewalld
        run_cmd firewall-cmd --permanent --add-service=ssh
        run_cmd firewall-cmd --permanent --add-service=http
        run_cmd firewall-cmd --permanent --add-service=https
        run_cmd firewall-cmd --reload
    fi
    print_status "Firewall configuré (SSH, HTTP, HTTPS autorisés)"

    echo ">>> Installation de Fail2ban..."
    pkg_install fail2ban
    enable_service fail2ban
    print_status "Fail2ban installé (protection SSH)"
fi

# ==========================================
# CONFIGURATION GIT
# ==========================================

print_header "Configuration Git"

if [ -n "$GIT_USER_NAME" ]; then
    git config --global user.name "$GIT_USER_NAME"
fi
if [ -n "$GIT_USER_EMAIL" ]; then
    git config --global user.email "$GIT_USER_EMAIL"
fi

if [ "$SETUP_SSH_KEY" = true ]; then
    SSH_KEY_PATH="$HOME/.ssh/id_ed25519"
    if [ ! -f "$SSH_KEY_PATH" ]; then
        echo ">>> Génération de la clé SSH..."
        mkdir -p "$HOME/.ssh"
        ssh-keygen -t ed25519 -C "$GIT_USER_EMAIL" -f "$SSH_KEY_PATH" -N ""
        eval "$(ssh-agent -s)"
        ssh-add "$SSH_KEY_PATH"
        print_status "Clé SSH générée"

        echo ""
        echo -e "${YELLOW}=========================================="
        echo "  IMPORTANT : Ajoutez cette clé à GitHub/GitLab"
        echo "==========================================${NC}"
        echo ""
        cat "${SSH_KEY_PATH}.pub"
        echo ""
        echo "Allez sur : https://github.com/settings/ssh/new"
        echo ""
        read -p "Appuyez sur Entrée une fois la clé ajoutée..."

        echo ">>> Test de connexion SSH..."
        ssh -T git@github.com 2>&1 || true
    else
        print_status "Clé SSH existante trouvée"
    fi
fi

# ==========================================
# NODE.JS
# ==========================================

print_header "Installation de Node.js"

NODE_MAJOR_REQUIRED=22

if ! command -v node &> /dev/null; then
    echo ">>> Installation de Node.js $NODE_MAJOR_REQUIRED..."
    if [ "$PKG_MANAGER" = "apt" ]; then
        curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR_REQUIRED}.x | run_cmd bash -
        pkg_install nodejs
    else
        curl -fsSL https://rpm.nodesource.com/setup_${NODE_MAJOR_REQUIRED}.x | run_cmd bash -
        pkg_install nodejs
    fi
    print_status "Node.js $(node -v) installé"
else
    NODE_CURRENT=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_CURRENT" -lt "$NODE_MAJOR_REQUIRED" ]; then
        print_warning "Node.js $(node -v) détecté — mise à jour vers Node.js $NODE_MAJOR_REQUIRED requise..."
        if [ "$PKG_MANAGER" = "apt" ]; then
            curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR_REQUIRED}.x | run_cmd bash -
            pkg_install nodejs
        else
            curl -fsSL https://rpm.nodesource.com/setup_${NODE_MAJOR_REQUIRED}.x | run_cmd bash -
            pkg_install nodejs
        fi
        print_status "Node.js $(node -v) mis à jour"
    else
        print_status "Node.js $(node -v) déjà installé"
    fi
fi

# ==========================================
# PNPM
# ==========================================

print_header "Installation de pnpm"

echo ">>> Installation/mise à jour de pnpm (dernière version stable)..."
run_cmd npm install -g pnpm@latest
print_status "pnpm $(pnpm -v) installé"

# ==========================================
# NGINX
# ==========================================

print_header "Installation de Nginx"

if ! command -v nginx &> /dev/null; then
    echo ">>> Installation de Nginx..."
    pkg_install nginx
    enable_service nginx

    if [ "$PKG_MANAGER" != "apt" ] && command -v setsebool &> /dev/null; then
        run_cmd setsebool -P httpd_can_network_connect 1 2>/dev/null || true
    fi
    print_status "Nginx installé"
else
    print_status "Nginx déjà installé"
fi

# ==========================================
# PM2
# ==========================================

print_header "Installation de PM2"

if ! command -v pm2 &> /dev/null; then
    echo ">>> Installation de PM2..."
    run_cmd npm install -g pm2
    print_status "PM2 installé"
else
    print_status "PM2 déjà installé"
fi

# ==========================================
# APPLICATION
# ==========================================

print_header "Configuration de l'application"

PARENT_DIR=$(dirname "$APP_DIR")
if [ ! -d "$PARENT_DIR" ]; then
    run_cmd mkdir -p "$PARENT_DIR"
    run_cmd chown $USER:$USER "$PARENT_DIR"
fi

if [ -n "$GIT_URL" ]; then
    if [ "$GIT_TYPE" = "https" ] && [ -n "$GIT_TOKEN" ]; then
        GIT_DOMAIN=$(echo "$GIT_URL" | sed -E 's|https://([^/]+)/.*|\1|')
        GIT_PATH=$(echo "$GIT_URL" | sed -E 's|https://[^/]+/(.*)|\1|')
        CLONE_URL="https://${GIT_TOKEN}@${GIT_DOMAIN}/${GIT_PATH}"
    else
        CLONE_URL="$GIT_URL"
    fi

    if [ -d "$APP_DIR" ]; then
        print_warning "Le répertoire existe déjà. Mise à jour..."
        cd "$APP_DIR"
        git pull origin "$GIT_BRANCH"
    else
        echo ">>> Clonage du dépôt..."
        git clone -b "$GIT_BRANCH" "$CLONE_URL" "$APP_DIR"

        if [ "$GIT_TYPE" = "https" ] && [ -n "$GIT_TOKEN" ]; then
            cd "$APP_DIR"
            git remote set-url origin "$GIT_URL"
            git config credential.helper store
            echo "https://${GIT_TOKEN}@${GIT_DOMAIN}" > ~/.git-credentials
            chmod 600 ~/.git-credentials
        fi
    fi
    run_cmd chown -R $USER:$USER "$APP_DIR"
    print_status "Dépôt cloné"
else
    if [ ! -d "$APP_DIR" ]; then
        print_error "Le répertoire $APP_DIR n'existe pas !"
        echo ""
        echo "Clonez d'abord votre dépôt avec :"
        echo "  sudo mkdir -p $PARENT_DIR"
        echo "  cd $PARENT_DIR"
        echo "  sudo git clone https://github.com/USERNAME/REPO.git $(basename $APP_DIR)"
        echo "  sudo chown -R \$USER:\$USER $APP_DIR"
        echo ""
        echo "Puis relancez ce script."
        exit 1
    fi
    print_status "Répertoire trouvé : $APP_DIR"
fi

cd "$APP_DIR"

# S'assurer que uploads/ existe et est accessible en écriture
API_DATA_DIR="$APP_DIR/artifacts/api-server"
run_cmd mkdir -p "$API_DATA_DIR/uploads"
run_cmd chown -R $USER:$USER "$API_DATA_DIR/uploads"
run_cmd chmod -R 755 "$API_DATA_DIR/uploads"
print_status "Dossier uploads/ prêt"

# ==========================================
# FICHIER .ENV
# ==========================================

print_header "Configuration de l'environnement"

ENV_FILE="$API_DATA_DIR/.env"

if [ -f "$ENV_FILE" ]; then
    print_warning "Fichier .env existant, sauvegarde vers .env.backup"
    cp "$ENV_FILE" "$ENV_FILE.backup"
fi

SESSION_SECRET=$(openssl rand -hex 32)

cat > "$ENV_FILE" << EOF
# Configuration générée automatiquement le $(date)
NODE_ENV=production
PORT=$API_PORT
ADMIN_SECRET=$ADMIN_SECRET
SESSION_SECRET=$SESSION_SECRET
EOF

if [ -n "$EXTRA_ENV" ]; then
    echo "" >> "$ENV_FILE"
    echo "# Variables personnalisées" >> "$ENV_FILE"
    echo -e "$EXTRA_ENV" >> "$ENV_FILE"
fi

chmod 600 "$ENV_FILE"
print_status "Fichier .env créé ($ENV_FILE)"

# ==========================================
# DÉPENDANCES PNPM
# ==========================================

print_header "Installation des dépendances"

echo ">>> Installation des dépendances pnpm..."
cd "$APP_DIR"
pnpm install
print_status "Dépendances installées"

# ==========================================
# BUILD
# ==========================================

print_header "Build de l'application"

echo ">>> Build de l'API (Express)..."
pnpm --filter @workspace/api-server run build
print_status "API compilée → artifacts/api-server/dist/"

echo ">>> Build du frontend (React/Vite)..."
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/mermaid-tails run build
print_status "Frontend compilé → artifacts/mermaid-tails/dist/"

# ==========================================
# SCRIPT DE DÉMARRAGE PM2
# ==========================================

print_header "Configuration PM2"

START_SCRIPT="$API_DATA_DIR/start.sh"

cat > "$START_SCRIPT" << STARTSCRIPT
#!/bin/bash
SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
cd "\$SCRIPT_DIR"
set -a
source .env
set +a
exec node --enable-source-maps dist/index.mjs
STARTSCRIPT

chmod +x "$START_SCRIPT"

pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 start "$START_SCRIPT" --name "$APP_NAME" --cwd "$API_DATA_DIR"
pm2 save

print_status "API démarrée avec PM2 (port $API_PORT)"

# ==========================================
# CONFIGURATION NGINX
# ==========================================

print_header "Configuration Nginx"

FRONTEND_DIST="$APP_DIR/artifacts/mermaid-tails/dist"

if [[ "$INCLUDE_WWW" =~ ^[oOyY]$ ]]; then
    SERVER_NAMES="$DOMAIN www.$DOMAIN"
else
    SERVER_NAMES="$DOMAIN"
fi

if [ "$PKG_MANAGER" = "apt" ]; then
    NGINX_CONF_DIR="/etc/nginx/sites-available"
    NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
    run_cmd mkdir -p "$NGINX_CONF_DIR" "$NGINX_ENABLED_DIR"
    NGINX_CONF_FILE="$NGINX_CONF_DIR/$APP_NAME"
else
    NGINX_CONF_DIR="/etc/nginx/conf.d"
    NGINX_ENABLED_DIR=""
    NGINX_CONF_FILE="$NGINX_CONF_DIR/$APP_NAME.conf"
fi

run_cmd tee $NGINX_CONF_FILE > /dev/null << EOF
server {
    listen 80;
    server_name $SERVER_NAMES;

    # Taille max upload (images catalogue)
    client_max_body_size 20M;

    # Logs
    access_log /var/log/nginx/${APP_NAME}_access.log;
    error_log /var/log/nginx/${APP_NAME}_error.log;

    # Proxy vers l'API Express
    location /api/ {
        proxy_pass http://localhost:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Frontend React (fichiers statiques)
    location / {
        root $FRONTEND_DIST;
        index index.html;
        try_files \$uri \$uri/ /index.html;

        # Cache pour les assets avec hash (JS, CSS, images)
        location ~* \.(js|css|png|jpg|jpeg|webp|gif|ico|svg|woff2?)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF

if [ "$PKG_MANAGER" = "apt" ]; then
    run_cmd ln -sf $NGINX_CONF_FILE $NGINX_ENABLED_DIR/$APP_NAME
    run_cmd rm -f $NGINX_ENABLED_DIR/default
fi

run_cmd nginx -t && run_cmd systemctl reload nginx
print_status "Nginx configuré"

# ==========================================
# DÉMARRAGE AUTOMATIQUE
# ==========================================

print_header "Configuration du démarrage automatique"

if [ "$RUN_AS_ROOT" = true ]; then
    pm2 startup systemd
else
    PM2_STARTUP=$(pm2 startup systemd -u $USER --hp $HOME 2>&1 | grep "sudo env")
    if [ -n "$PM2_STARTUP" ]; then
        eval $PM2_STARTUP
    fi
fi
pm2 save
print_status "Démarrage automatique configuré"

# ==========================================
# SSL
# ==========================================

print_header "Certificat SSL"

echo "Options SSL :"
echo "  1) Let's Encrypt (génération automatique)"
echo "  2) Certificat personnalisé (vous avez vos propres fichiers)"
echo "  3) Ignorer pour le moment"
read -p "Choix [1]: " SSL_CHOICE
SSL_CHOICE=${SSL_CHOICE:-1}

case $SSL_CHOICE in
    1)
        echo ">>> Installation de Certbot..."
        if [ "$PKG_MANAGER" = "apt" ]; then
            pkg_install certbot python3-certbot-nginx
        else
            pkg_install certbot python3-certbot-nginx
        fi

        echo ">>> Génération du certificat..."
        if [[ "$INCLUDE_WWW" =~ ^[oOyY]$ ]]; then
            run_cmd certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || {
                print_warning "Échec SSL automatique. Essayez manuellement :"
                echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
            }
        else
            run_cmd certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || {
                print_warning "Échec SSL automatique. Essayez manuellement :"
                echo "  sudo certbot --nginx -d $DOMAIN"
            }
        fi
        print_status "SSL Let's Encrypt configuré"
        INSTALL_SSL="yes"
        ;;
    2)
        echo ""
        print_info "Configuration du certificat SSL personnalisé"
        echo ""
        read -p "Chemin vers le certificat (.crt, .pem ou fullchain) : " SSL_CERT_PATH
        read -p "Chemin vers la clé privée (.key ou privkey.pem) : " SSL_KEY_PATH

        if [ ! -f "$SSL_CERT_PATH" ] || [ ! -f "$SSL_KEY_PATH" ]; then
            print_warning "Fichiers non trouvés. Configuration SSL ignorée."
            INSTALL_SSL="no"
        else
            run_cmd tee $NGINX_CONF_FILE > /dev/null << EOF
# Redirection HTTP → HTTPS
server {
    listen 80;
    server_name $SERVER_NAMES;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $SERVER_NAMES;

    ssl_certificate $SSL_CERT_PATH;
    ssl_certificate_key $SSL_KEY_PATH;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    add_header Strict-Transport-Security "max-age=63072000" always;

    client_max_body_size 20M;

    access_log /var/log/nginx/${APP_NAME}_access.log;
    error_log /var/log/nginx/${APP_NAME}_error.log;

    location /api/ {
        proxy_pass http://localhost:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    location / {
        root $FRONTEND_DIST;
        index index.html;
        try_files \$uri \$uri/ /index.html;

        location ~* \.(js|css|png|jpg|jpeg|webp|gif|ico|svg|woff2?)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF
            run_cmd nginx -t && run_cmd systemctl reload nginx
            print_status "SSL personnalisé configuré"
            INSTALL_SSL="yes"
        fi
        ;;
    3|*)
        print_info "SSL ignoré. Pour l'installer plus tard :"
        if [ "$PKG_MANAGER" = "apt" ]; then
            echo "  sudo apt install certbot python3-certbot-nginx"
        else
            echo "  sudo dnf install certbot python3-certbot-nginx"
        fi
        if [[ "$INCLUDE_WWW" =~ ^[oOyY]$ ]]; then
            echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
        else
            echo "  sudo certbot --nginx -d $DOMAIN"
        fi
        INSTALL_SSL="no"
        ;;
esac

# ==========================================
# RÉSUMÉ FINAL
# ==========================================

print_header "INSTALLATION TERMINÉE !"

echo -e "${GREEN}Mermaid Aquata est maintenant en ligne !${NC}"
echo ""
echo "Système : $DISTRO_NAME"
echo ""
echo "Accès :"
if [ "$INSTALL_SSL" = "yes" ]; then
    echo "  - https://$DOMAIN"
    if [[ "$INCLUDE_WWW" =~ ^[oOyY]$ ]]; then
        echo "  - https://www.$DOMAIN"
    fi
    echo "  - https://$DOMAIN/admin  (backoffice)"
else
    echo "  - http://$DOMAIN"
    echo "  - http://$DOMAIN/admin  (backoffice)"
fi
echo ""
echo "Fichiers importants :"
echo "  - Application      : $APP_DIR"
echo "  - Variables (.env) : $ENV_FILE"
echo "  - Données JSON     : $API_DATA_DIR/data/"
echo "  - Images uploadées : $API_DATA_DIR/uploads/"
echo "  - Frontend dist    : $FRONTEND_DIST"
echo "  - Nginx            : $NGINX_CONF_FILE"
echo ""
echo "Commandes utiles :"
echo "  - Voir les logs API    : pm2 logs $APP_NAME"
echo "  - Redémarrer l'API    : pm2 restart $APP_NAME"
echo "  - Status              : pm2 status"
echo "  - Logs Nginx          : sudo tail -f /var/log/nginx/${APP_NAME}_error.log"
echo ""
echo "Mise à jour du site (après git pull) :"
echo "  cd $APP_DIR"
echo "  git pull"
echo "  pnpm install"
echo "  pnpm --filter @workspace/api-server run build"
echo "  pnpm --filter @workspace/mermaid-tails run build"
echo "  pm2 restart $APP_NAME"
echo ""

print_status "Installation complète !"
