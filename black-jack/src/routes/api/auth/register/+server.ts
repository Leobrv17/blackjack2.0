import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '$lib/server/prisma';

// Définir une clé secrète de secours si la variable d'environnement n'est pas disponible
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_par_defaut';

export async function POST({ request, cookies }) {
    try {
        const { email, password } = await request.json();

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Définir le cookie
        cookies.set('token', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 // 24 heures
        });

        return json({ success: true, token });
    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        return json({ error: 'Erreur de serveur' }, { status: 500 });
    }
}