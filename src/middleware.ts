import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    let sessionCookie: any = getSessionCookie(request);

    if (!sessionCookie) {
        sessionCookie = request.cookies.get("better-auth.session_token")?.value; // Manual fallback
    }

    console.log("Session Cookie:", sessionCookie);

    if (!sessionCookie) {
        console.log("No session found, redirecting to login.");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};