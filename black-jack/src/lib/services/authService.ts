import { authStore, type User } from '$lib/stores/authStore';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

// Type de réponse pour les fonctions d'authentification
type AuthResponse = {
    success: boolean;
    message?: string;
};

// Fonction de login
export async function login(email: string, password: string): Promise<AuthResponse> {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.error || 'Identifiants invalides'
            };
        }

        // Mettre à jour le store d'authentification
        const user: User = {
            id: String(data.userId),
            username: email.split('@')[0], // On utilise la partie locale de l'email comme nom d'utilisateur
            email: email
        };

        authStore.login(user, data.token);

        return {
            success: true
        };
    } catch (error) {
        console.error('Erreur de connexion:', error);
        return {
            success: false,
            message: 'Erreur de connexion au serveur'
        };
    }
}

// Fonction d'inscription
export async function register(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.error || 'Inscription échouée'
            };
        }

        // Mettre à jour le store d'authentification
        const user: User = {
            id: String(data.userId),
            username: username || email.split('@')[0],
            email: email
        };

        authStore.login(user, data.token);

        return {
            success: true
        };
    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        return {
            success: false,
            message: 'Erreur de connexion au serveur'
        };
    }
}

// Fonction de déconnexion
export function logout(): void {
    // Supprimer le cookie côté serveur
    fetch('/api/auth/logout', { method: 'POST' });
    
    // Mettre à jour le store d'authentification
    authStore.logout();
    
    // Rediriger vers la page d'accueil
    goto('/');
}

// Vérifier l'état d'authentification au chargement de l'application
export function checkAuthStatus(): void {
    if (browser) {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
            const user = JSON.parse(storedUser);
            authStore.login(user, storedToken);
        }
    }
}

// Vérifier si l'utilisateur est connecté
export function isAuthenticated(): boolean {
    let isAuth = false;
    const unsubscribe = authStore.subscribe(state => {
        isAuth = state.isAuthenticated;
    });
    unsubscribe();
    return isAuth;
}