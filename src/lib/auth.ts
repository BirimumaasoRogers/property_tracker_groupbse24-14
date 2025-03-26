import { connectDB } from "@/lib/mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

let authInstance: any = null;

export async function getAuth() {
    if (!authInstance) {
        const db = (await connectDB()).connection.db; // Ensure connection before accessing DB

        authInstance = betterAuth({
            database: mongodbAdapter(db),
            emailAndPassword: { enabled: true, autoSignIn: false },
            session: {
                expiresIn: 60 * 60 * 24 * 7, // 7 days
                updateAge: 60 * 60 * 24, // 1 day
                cookie: {
                    name: "better-auth.session_token",
                    options: {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                    },
                },
            },
            secret: process.env.BETTER_AUTH_SECRET,
        });
    }
    return authInstance;
}

// Export a function to create a new auth instance for API routes
export async function createAuthInstance() {
    const db = (await connectDB()).connection.db; // Ensure DB connection

    return betterAuth({
        database: mongodbAdapter(db),
        emailAndPassword: { enabled: true, autoSignIn: false },
        session: {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
            updateAge: 60 * 60 * 24, // 1 day
            cookie: {
                name: "better-auth.session_token",
                options: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production" || process.env.USE_NGROK === "true",
                    sameSite: process.env.USE_NGROK === "true" ? "None" : "Lax",
                },
            },
        },
        secret: process.env.BETTER_AUTH_SECRET,
    });
}