import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import prisma from '$lib/server/prisma';

// Routes protégées qui nécessitent une authentification
const PROTECTED_ROUTES = ['/game', '/profile'];

// Définir une clé secrète de secours si la variable d'environnement n'est pas disponible
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_par_defaut';

export const handle: Handle = async ({ event, resolve }) => {
    // Récupérer le token des cookies
    const token = event.cookies.get('token');
    
    // Vérifier si la route est protégée
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
        event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
    );
    
    // Si la route est protégée et qu'il n'y a pas de token valide, rediriger vers la connexion
    if (isProtectedRoute) {
        if (!token) {
            return new Response(null, {
                status: 303,
                headers: {
                    Location: `/login?redirectTo=${event.url.pathname}`
                }
            });
        }
        
        // Vérifier la validité du token
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
            
            // Vérifier que l'utilisateur existe toujours en base de données
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId }
            });
            
            if (!user) {
                // L'utilisateur n'existe plus, on supprime le cookie et on redirige
                event.cookies.delete('token', { path: '/' });
                return new Response(null, {
                    status: 303,
                    headers: {
                        Location: `/login?redirectTo=${event.url.pathname}`
                    }
                });
            }
            
            // Ajouter les informations utilisateur à l'event pour les utiliser dans les routes
            event.locals.user = {
                id: user.id,
                email: user.email
            };
        } catch (error) {
            // Token invalide, on supprime le cookie et on redirige
            event.cookies.delete('token', { path: '/' });
            return new Response(null, {
                status: 303,
                headers: {
                    Location: `/login?redirectTo=${event.url.pathname}`
                }
            });
        }
    }
    
    // Continuer le traitement de la requête
    return await resolve(event);
};