import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import bcrypt from 'bcrypt';

export async function POST({ request }) {
	const { email, password } = await request.json();

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await prisma.user.create({
			data: {
				email,
				password: hashedPassword
			}
		});
		return json({ message: 'User registered successfully' });
	} catch (e) {
		return json({ error: 'User already exists or server error' }, { status: 400 });
	}
}
