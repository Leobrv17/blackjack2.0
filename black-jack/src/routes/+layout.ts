import { checkAuthStatus } from '$lib/services/authService';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
    // Vérifier l'état d'authentification de l'utilisateur au chargement de l'application
    if (browser) {
        checkAuthStatus();
    }
    
    return {};
};

// Indiquer que cette fonction s'exécute aussi bien côté serveur que côté client
export const ssr = true;
export const prerender = false;