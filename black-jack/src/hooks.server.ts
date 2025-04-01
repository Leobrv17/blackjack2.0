import type { Handle } from '@sveltejs/kit';

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/game', '/profile'];

export const handle: Handle = async ({ event, resolve }) => {
    // Get the token from cookies
    const token = event.cookies.get('token');
    
    // Check if the route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
        event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
    );
    
    // If the route is protected and there's no valid token, redirect to login
    if (isProtectedRoute && !token) {
        return new Response(null, {
            status: 303,
            headers: {
                Location: `/login?redirectTo=${event.url.pathname}`
            }
        });
    }
    
    // Continue processing the request
    return await resolve(event);
};