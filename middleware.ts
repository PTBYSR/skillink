
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check for token
    const token = request.cookies.get('token')?.value;

    // Define protected routes
    const protectedRoutes = ['/swipe', '/matches', '/onboarding', '/me', '/safety'];

    // Check if current path starts with any protected route
    const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // If we are on auth page and have token, redirect to swipe
    if (request.nextUrl.pathname === '/auth' && token) {
        return NextResponse.redirect(new URL('/swipe', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
