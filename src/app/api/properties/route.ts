import { NextResponse } from "next/server";
import { createAuthInstance } from "@/lib/auth";
import Property from "@/models/Property";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        await connectDB();
        
        const auth = await createAuthInstance();
        const cookieHeader = req.headers.get('cookie');
        const sessionToken = cookieHeader?.match(/(?:better-auth\.session_token|__Secure-better-auth\.session_token)=([^;]+)/)?.[1];
        console.log("Session Token:", sessionToken); // Log the session token here

        if (!sessionToken) {
            return NextResponse.json({ success: false, error: 'No session token found' }, { status: 401 });
        }

        const session = await auth.api.getSession({
            headers: new Headers({
                Cookie: cookieHeader // Use the original cookie header
            })
        });

        if (!session?.session || !session?.user) {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }

        const properties = await Property.find({ userId: session.user.id });

        const response = NextResponse.json({ success: true, data: properties });
        // Add CORS headers
        response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_APP_URL || "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch properties" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const auth = await createAuthInstance();
        const cookieHeader = req.headers.get('cookie');
        const sessionToken = cookieHeader?.match(/(?:better-auth\.session_token|__Secure-better-auth\.session_token)=([^;]+)/)?.[1];
        console.log("Session Token:", sessionToken); // Log the session token here

        if (!sessionToken) {
            return NextResponse.json({ success: false, error: 'No session token found' }, { status: 401 });
        }

        const session = await auth.api.getSession({
            headers: new Headers({
                Cookie: cookieHeader // Use the original cookie header
            })
        });

        if (!session?.session || !session?.user) {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }

        const data = await req.json();
        console.log("Received Data:", data);

        const property = new Property({
            ...data,
            userId: session.user.id,
        });
        console.log("Property Data to be saved", property);

        const propertyResult = await property.save();

        const response = NextResponse.json({ success: true, data: propertyResult });
        // Add CORS headers
        response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_APP_URL || "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return response;
    } catch (error) {
        console.error("Error creating property:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create property" },
            { status: 500 }
        );
    }
}
