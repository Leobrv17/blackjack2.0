import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
	// Supprimer le cookie d'authentification
	cookies.delete('token', { path: '/' });
	
	return json({ success: true });
}