import { NextResponse } from "next/server";
import { createAuthInstance } from "@/lib/auth";
import Property from "@/models/Property";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        await connectDB();
        
        const auth = await createAuthInstance();
        const sessionToken = req.headers.get('cookie')?.match(/better-auth\.session_token=([^;]+)/)?.[1];

        if (!sessionToken) {
            return NextResponse.json({ success: false, error: 'No session token found' }, { status: 401 });
        }

        const session = await auth.api.getSession({
            headers: new Headers({
                Cookie: `better-auth.session_token=${sessionToken}`
            })
        });

        if (!session?.session || !session?.user) {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }

        const properties = await Property.find({ userId: session.user.id });

        return NextResponse.json({ success: true, data: properties });
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
        const sessionToken = req.headers.get('cookie')?.match(/better-auth\.session_token=([^;]+)/)?.[1];

        if (!sessionToken) {
            return NextResponse.json({ success: false, error: 'No session token found' }, { status: 401 });
        }

        const session = await auth.api.getSession({
            headers: new Headers({
                Cookie: `better-auth.session_token=${sessionToken}`
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

        return NextResponse.json({ success: true, data: propertyResult });
    } catch (error) {
        console.error("Error creating property:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create property" },
            { status: 500 }
        );
    }
}
