#!/bin/bash

# Script de démarrage pour l'application Duolingo Progress Bar
# Lance le backend WebSocket et le frontend React

echo "🚀 Démarrage de l'application Duolingo Progress Bar..."

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les logs avec couleur
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')]${NC} ❌ $1"
}

warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')]${NC} ⚠️  $1"
}

info() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} ℹ️  $1"
}

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    error "Veuillez exécuter ce script depuis la racine du projet vertx.ai"
    exit 1
fi

log "📦 Vérification des dépendances..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    error "Python 3 n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Installer les dépendances backend si nécessaire
if [ ! -d "backend/env" ]; then
    log "🐍 Création de l'environnement virtuel Python..."
    cd backend
    python3 -m venv env
    source env/bin/activate
    pip install -r requirements.txt
    cd ..
else
    log "✅ Environnement virtuel Python déjà configuré"
fi

# Installer les dépendances frontend si nécessaire
if [ ! -d "frontend/node_modules" ]; then
    log "📦 Installation des dépendances Node.js..."
    cd frontend
    npm install
    cd ..
else
    log "✅ Dépendances Node.js déjà installées"
fi

# Créer les répertoires de logs
mkdir -p logs

log "🖥️  Démarrage des services..."

# Démarrer le backend WebSocket
info "Backend WebSocket: http://localhost:5000"
cd backend
source env/bin/activate
python websocket_progress_server.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Attendre que le backend soit prêt
sleep 3

# Vérifier si le backend est lancé
if kill -0 $BACKEND_PID 2>/dev/null; then
    log "✅ Backend WebSocket démarré (PID: $BACKEND_PID)"
else
    error "Le backend WebSocket n'a pas pu démarrer"
    cat logs/backend.log
    exit 1
fi

# Démarrer le frontend React
info "Frontend React: http://localhost:3000"
cd frontend
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Attendre que le frontend soit prêt
sleep 5

# Vérifier si le frontend est lancé
if kill -0 $FRONTEND_PID 2>/dev/null; then
    log "✅ Frontend React démarré (PID: $FRONTEND_PID)"
else
    error "Le frontend React n'a pas pu démarrer"
    cat logs/frontend.log
    exit 1
fi

# Afficher les informations de connexion
echo ""
echo "🎉 Application démarrée avec succès !"
echo ""
echo "📱 Frontend (Interface utilisateur):"
echo "   URL: http://localhost:3000"
echo ""
echo "🔧 Backend (API WebSocket):"
echo "   URL: http://localhost:5000"
echo "   Statistiques: http://localhost:5000/stats"
echo ""
echo "📊 Barre de progression Duolingo:"
echo "   - Checkpoints: 25%, 50%, 75%, 100%"
echo "   - WebSocket: Mises à jour en temps réel"
echo "   - Animations: Confettis et récompenses"
echo ""
echo "🛠️  Commandes utiles:"
echo "   - Arrêter l'application: Ctrl+C"
echo "   - Logs backend: tail -f logs/backend.log"
echo "   - Logs frontend: tail -f logs/frontend.log"
echo ""

# Sauvegarder les PIDs pour pouvoir les arrêter plus tard
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

# Fonction de nettoyage à l'arrêt
cleanup() {
    echo ""
    warning "Arrêt de l'application..."
    
    if [ -f logs/backend.pid ]; then
        BACKEND_PID=$(cat logs/backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            log "Backend WebSocket arrêté"
        fi
        rm -f logs/backend.pid
    fi
    
    if [ -f logs/frontend.pid ]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            log "Frontend React arrêté"
        fi
        rm -f logs/frontend.pid
    fi
    
    log "Application arrêtée proprement"
    exit 0
}

# Capturer Ctrl+C pour un arrêt propre
trap cleanup SIGINT SIGTERM

# Attendre indéfiniment (jusqu'à Ctrl+C)
while true; do
    sleep 1
    
    # Vérifier si les processus sont toujours actifs
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        error "Le backend WebSocket s'est arrêté inopinément"
        cat logs/backend.log | tail -20
        cleanup
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        error "Le frontend React s'est arrêté inopinément"
        cat logs/frontend.log | tail -20
        cleanup
    fi
done
