import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    // Si l'utilisateur n'est pas authentifié, il sera redirigé par le hook
    // Ce code n'est qu'une sécurité supplémentaire
    if (!locals.user) {
        throw redirect(303, '/login?redirectTo=/game');
    }

    return {
        // Données spécifiques à la page de jeu
        user: {
            id: locals.user.id,
            email: locals.user.email
        }
    };
};