import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
    // Si l'utilisateur n'est pas authentifié, il sera redirigé par le hook
    if (!locals.user) {
        throw redirect(303, '/login?redirectTo=/profile');
    }

    // Récupérer les informations complètes de l'utilisateur
    const user = await prisma.user.findUnique({
        where: { id: locals.user.id },
        select: {
            id: true,
            email: true,
            createdAt: true
            // Ajoutez d'autres champs ici si vous les ajoutez à votre modèle User
        }
    });

    if (!user) {
        // Si l'utilisateur n'existe plus en base de données
        throw redirect(303, '/login');
    }

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.email.split('@')[0], // Utilisation de la partie locale de l'email comme nom d'utilisateur
            createdAt: user.createdAt
        }
    };
};