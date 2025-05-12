import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import prisma from '$lib/server/prisma';

// Définir une clé secrète de secours si la variable d'environnement n'est pas disponible
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_par_defaut';

export async function POST({ request, cookies }) {
	// Récupérer le token existant depuis les cookies
	const token = cookies.get('token');
	
	// Si pas de token, retourner une erreur
	if (!token) {
		return json({ error: 'Aucun token à rafraîchir' }, { status: 401 });
	}
	
	try {
		// Vérifier le token et récupérer les données utilisateur
		const decoded = jwt.verify(token, JWT_SECRET) as { userId: number, email: string, exp: number };
		
		// Vérifier que l'utilisateur existe toujours en base de données
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId }
		});
		
		if (!user) {
			cookies.delete('token', { path: '/' });
			return json({ error: 'Utilisateur introuvable' }, { status: 401 });
		}
		
		// Générer un nouveau token avec une nouvelle expiration
		const newToken = jwt.sign(
			{ userId: decoded.userId, email: decoded.email },
			JWT_SECRET,
			{ expiresIn: '24h' }
		);
		
		// Définir le nouveau cookie
		cookies.set('token', newToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 // 24 heures
		});
		
		return json({ success: true, token: newToken });
	} catch (error) {
		// Token invalide ou expiré
		cookies.delete('token', { path: '/' });
		return json({ error: 'Token invalide ou expiré' }, { status: 401 });
	}
}