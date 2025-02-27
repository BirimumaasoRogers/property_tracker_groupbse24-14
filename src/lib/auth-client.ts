import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

const baseURL = process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth`
    : typeof window !== 'undefined' 
        ? `${window.location.origin}/api/auth`
        : 'http://localhost:3000/api/auth'; // Fallback for SSR

export const authClient = createAuthClient({
    baseURL,
    plugins: [adminClient()],
});