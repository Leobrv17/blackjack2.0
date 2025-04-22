import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';

const prisma = new PrismaClient();

export async function POST({ request }) {
	const { email, password } = await request.json();

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '2h' });

	return json({ token });
}


