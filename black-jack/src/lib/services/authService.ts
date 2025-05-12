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

        // Configurer le rafraîchissement automatique du token
        setupTokenRefresh();

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

        // Configurer le rafraîchissement automatique du token
        setupTokenRefresh();

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
    
    // Annuler le rafraîchissement automatique du token
    clearTokenRefresh();
    
    // Mettre à jour le store d'authentification
    authStore.logout();
    
    // Rediriger vers la page d'accueil
    goto('/');
}

// Rafraîchir le token
export async function refreshToken(): Promise<boolean> {
    try {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            // Si le rafraîchissement échoue, déconnecter l'utilisateur
            authStore.logout();
            return false;
        }

        // Mettre à jour le token dans le store
        authStore.updateToken(data.token);
        return true;
    } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        return false;
    }
}

// Variable pour stocker l'intervalle de rafraîchissement
let refreshInterval: number | null = null;

// Configurer le rafraîchissement automatique du token
function setupTokenRefresh(): void {
    if (browser) {
        // Nettoyer tout intervalle existant
        clearTokenRefresh();
        
        // Rafraîchir le token toutes les 20 minutes (20 * 60 * 1000 ms)
        // Cela permettra de garder la session active tant que l'utilisateur utilise l'application
        refreshInterval = window.setInterval(refreshToken, 20 * 60 * 1000);
        
        // Également rafraîchir le token lors de la reprise d'activité
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }
}

// Nettoyer le rafraîchissement automatique du token
function clearTokenRefresh(): void {
    if (browser && refreshInterval !== null) {
        window.clearInterval(refreshInterval);
        refreshInterval = null;
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
}

// Gérer le changement de visibilité de la page
function handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
        // Si l'utilisateur revient sur la page, rafraîchir immédiatement le token
        refreshToken();
    }
}

// Vérifier l'état d'authentification au chargement de l'application
export function checkAuthStatus(): void {
    if (browser) {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
            const user = JSON.parse(storedUser);
            authStore.login(user, storedToken);
            
            // Configurer le rafraîchissement automatique du token
            setupTokenRefresh();
            
            // Rafraîchir immédiatement le token pour s'assurer qu'il est valide
            refreshToken();
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