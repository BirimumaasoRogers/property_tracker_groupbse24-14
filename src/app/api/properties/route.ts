import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { createAuthInstance } from "@/lib/auth";

export async function GET(req: Request) {
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

        const client = await clientPromise;
        const db = client.db("property-tracker");
        const properties = await db.collection("properties").find({ userId: session.user.id }).toArray();

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

        const client = await clientPromise;
        const db = client.db("property-tracker");
        const data = await req.json();

        const property = {
            ...data,
            userId: session.user.id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const propertyResult = await db.collection("properties").insertOne(property);

        // Create an initial location record for the property
        const initialLocation = {
            propertyId: propertyResult.insertedId,
            userId: session.user.id,
            coordinates: { lat: 0, lng: 0 }, // Default or placeholder coordinates
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await db.collection("locations").insertOne(initialLocation);

        return NextResponse.json({ success: true, data: propertyResult });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to create property" },
            { status: 500 }
        );
    }
}
