import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, parent }) => {
    const token = cookies.get('token');

    if (!token) {
        throw redirect(303, '/login?redirectTo=/game');
    }

    // We have a token, so we're good to go
    return {
        // Game page specific data could go here
    };
};