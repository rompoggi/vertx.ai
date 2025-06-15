"""
Serveur WebSocket pour la barre de progression Duolingo
Gère les mises à jour de progression en temps réel via WebSocket
"""
from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import time
import random
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'duolingo_progress_secret'

# Configuration CORS pour permettre les connexions depuis le frontend
CORS(app, origins="http://localhost:3000")
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

# Stockage en mémoire de la progression des utilisateurs
user_progress = {}

class ProgressManager:
    """Gestionnaire de progression avec logique d'évaluation IA simulée"""
    
    def __init__(self):
        self.base_increment = 10  # Progression de base par bonne réponse
        self.streak_bonus = 0
        self.difficulty_multiplier = 1.0
    
    def evaluate_answer(self, answer_data):
        """
        Simule l'évaluation d'une réponse par l'IA
        
        Args:
            answer_data (dict): Données de la réponse soumise
            
        Returns:
            dict: Résultat de l'évaluation avec progression et récompenses
        """
        # Simulation de l'évaluation IA (70% de chance de bonne réponse)
        is_correct = random.random() > 0.3
        
        if is_correct:
            # Calcul de la progression
            progress_increment = self.base_increment
            
            # Bonus de streak (réponses consécutives correctes)
            self.streak_bonus = min(self.streak_bonus + 2, 10)
            progress_increment += self.streak_bonus
            
            # Multiplicateur de difficulté
            progress_increment = int(progress_increment * self.difficulty_multiplier)
            
            reward_message = self._generate_reward_message(progress_increment)
            
            return {
                'success': True,
                'progress_increment': progress_increment,
                'reward': reward_message,
                'streak': self.streak_bonus,
                'message': '✅ Excellent ! Bonne réponse !'
            }
        else:
            # Réinitialiser le streak en cas d'erreur
            self.streak_bonus = 0
            return {
                'success': False,
                'progress_increment': 0,
                'reward': None,
                'streak': 0,
                'message': '❌ Oups ! Essayez encore.'
            }
    
    def _generate_reward_message(self, increment):
        """Génère un message de récompense basé sur la progression"""
        if increment >= 15:
            return "🔥 Streak de feu ! +" + str(increment) + "%"
        elif increment >= 12:
            return "⭐ Super performance ! +" + str(increment) + "%"
        else:
            return "👍 Bien joué ! +" + str(increment) + "%"

# Instance globale du gestionnaire de progression
progress_manager = ProgressManager()

@socketio.on('connect')
def handle_connect():
    """Gestion de la connexion d'un client"""
    print(f'🔗 Client connecté: {request.sid}')
    
    # Initialiser la progression du client s'il n'existe pas
    if request.sid not in user_progress:
        user_progress[request.sid] = {
            'progress': 0,
            'checkpoints_reached': [],
            'start_time': time.time(),
            'total_answers': 0,
            'correct_answers': 0
        }
    
    # Envoyer la progression actuelle au client
    emit('progress_update', {
        'type': 'progress_update',
        'progress': user_progress[request.sid]['progress'],
        'message': 'Connexion établie - Prêt à apprendre ! 🚀'
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Gestion de la déconnexion d'un client"""
    print(f'🔌 Client déconnecté: {request.sid}')
    
    # Optionnel: sauvegarder la progression avant suppression
    if request.sid in user_progress:
        session_data = user_progress[request.sid]
        session_duration = time.time() - session_data['start_time']
        accuracy = (session_data['correct_answers'] / max(session_data['total_answers'], 1)) * 100
        
        print(f'📊 Session terminée:')
        print(f'   - Durée: {session_duration:.1f}s')
        print(f'   - Progression: {session_data["progress"]}%')
        print(f'   - Précision: {accuracy:.1f}%')
        
        # Supprimer les données de session
        del user_progress[request.sid]

@socketio.on('answer_submission')
def handle_answer_submission(data):
    """
    Traite la soumission d'une réponse et met à jour la progression
    
    Args:
        data (dict): Données de la réponse soumise
    """
    print(f'📝 Réponse reçue de {request.sid}: {data}')
    
    if request.sid not in user_progress:
        user_progress[request.sid] = {
            'progress': 0,
            'checkpoints_reached': [],
            'start_time': time.time(),
            'total_answers': 0,
            'correct_answers': 0
        }
    
    user_data = user_progress[request.sid]
    user_data['total_answers'] += 1
    
    # Évaluer la réponse avec l'IA simulée
    evaluation = progress_manager.evaluate_answer(data)
    
    if evaluation['success']:
        user_data['correct_answers'] += 1
        
        # Mettre à jour la progression
        new_progress = min(user_data['progress'] + evaluation['progress_increment'], 100)
        user_data['progress'] = new_progress
        
        # Vérifier les nouveaux checkpoints atteints
        checkpoints = [25, 50, 75, 100]
        new_checkpoints = []
        
        for checkpoint in checkpoints:
            if (new_progress >= checkpoint and 
                checkpoint not in user_data['checkpoints_reached']):
                user_data['checkpoints_reached'].append(checkpoint)
                new_checkpoints.append(checkpoint)
        
        # Préparer la réponse
        response_data = {
            'type': 'progress_update',
            'progress': new_progress,
            'increment': evaluation['progress_increment'],
            'message': evaluation['message'],
            'reward': evaluation['reward'],
            'streak': evaluation['streak'],
            'new_checkpoints': new_checkpoints,
            'accuracy': (user_data['correct_answers'] / user_data['total_answers']) * 100
        }
        
        # Ajouter des messages spéciaux pour les checkpoints
        if new_checkpoints:
            for checkpoint in new_checkpoints:
                if checkpoint == 100:
                    response_data['special_message'] = '🐉 FÉLICITATIONS ! Vous avez vaincu le boss final !'
                else:
                    response_data['special_message'] = f'⭐ Checkpoint {checkpoint}% débloqué !'
        
        print(f'✅ Progression mise à jour: {new_progress}% (+{evaluation["progress_increment"]}%)')
        
    else:
        # Réponse incorrecte
        response_data = {
            'type': 'progress_update',
            'progress': user_data['progress'],
            'increment': 0,
            'message': evaluation['message'],
            'reward': None,
            'streak': 0,
            'accuracy': (user_data['correct_answers'] / user_data['total_answers']) * 100
        }
        
        print(f'❌ Réponse incorrecte - Progression inchangée: {user_data["progress"]}%')
    
    # Envoyer la mise à jour au client
    emit('progress_update', response_data)

@socketio.on('reset_progress')
def handle_reset_progress():
    """Remet à zéro la progression d'un utilisateur"""
    print(f'🔄 Remise à zéro demandée par {request.sid}')
    
    if request.sid in user_progress:
        user_progress[request.sid] = {
            'progress': 0,
            'checkpoints_reached': [],
            'start_time': time.time(),
            'total_answers': 0,
            'correct_answers': 0
        }
        
        # Réinitialiser le gestionnaire de progression
        global progress_manager
        progress_manager = ProgressManager()
        
        emit('progress_update', {
            'type': 'progress_update',
            'progress': 0,
            'message': '🔄 Progression remise à zéro - C\'est reparti !',
            'reward': None
        })

@app.route('/')
def index():
    """Page d'accueil avec statut du serveur"""
    return {
        'status': 'Serveur WebSocket Duolingo actif',
        'connected_users': len(user_progress),
        'endpoint': 'ws://localhost:5000',
        'frontend_url': 'http://localhost:3000'
    }

@app.route('/stats')
def get_stats():
    """Statistiques globales du serveur"""
    total_users = len(user_progress)
    
    if total_users == 0:
        return {
            'total_users': 0,
            'average_progress': 0,
            'total_answers': 0,
            'global_accuracy': 0
        }
    
    total_progress = sum(data['progress'] for data in user_progress.values())
    total_answers = sum(data['total_answers'] for data in user_progress.values())
    total_correct = sum(data['correct_answers'] for data in user_progress.values())
    
    return {
        'total_users': total_users,
        'average_progress': total_progress / total_users,
        'total_answers': total_answers,
        'global_accuracy': (total_correct / max(total_answers, 1)) * 100,
        'users_at_100_percent': len([d for d in user_progress.values() if d['progress'] >= 100])
    }

if __name__ == '__main__':
    print('🚀 Démarrage du serveur WebSocket Duolingo...')
    print('📡 Backend accessible sur: http://localhost:5000')
    print('🌐 Frontend à connecter sur: http://localhost:3000')
    print('📊 Statistiques disponibles sur: http://localhost:5000/stats')
    
    # Démarrer le serveur avec support WebSocket
    socketio.run(
        app, 
        host='0.0.0.0', 
        port=5000, 
        debug=True,
        allow_unsafe_werkzeug=True
    )
