import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "@/lib/mongodb";

export async function createAuthInstance() {
    const client = await clientPromise;
    const db = client.db("property-tracker");

    return betterAuth({
        database: mongodbAdapter(db),
        emailAndPassword: {  
            enabled: true,
            autoSignIn: false
        },
        session: {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
            updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
        }
    });
}

// Export an async function to retrieve auth dynamically
export const auth = createAuthInstance();