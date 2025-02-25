import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import { get } from "http";

const getBaseURL = () => {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/`;
    }
    
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/api/auth/`;
    }
    
    return '/api/auth'; // fallback for SSR
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    plugins: [adminClient()],
});