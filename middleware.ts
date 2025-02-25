import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAuthInstance } from "@/lib/auth";

export async function middleware(req: NextRequest) {
    const auth = await createAuthInstance(); // Get the auth instance

    try {
        // Use the `auth.handler` directly for session validation (if it's available)
        const response = await auth.handler(req);
        console.log("Auth response:", response);
        
        if (response.status !== 200) {
            // If response indicates no session, redirect to login
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // If session exists, allow the request to proceed
        return NextResponse.next();
    } catch (error) {
        console.error("Error during auth check:", error);
        // Handle any unexpected errors
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

// Required for Next.js middleware
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};