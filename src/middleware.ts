import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from 'better-auth/cookies'

// Middleware function to check authentication
export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    // If no session exists, redirect to login page
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

// Middleware configuration: Define routes that require authentication
export const config = {
    matcher: [
        "/dashboard", 
    ],
};