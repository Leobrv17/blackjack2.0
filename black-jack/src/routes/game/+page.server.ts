import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get('token');

    if (!token) {
        throw redirect(303, '/login?redirectTo=/game');
    }
};