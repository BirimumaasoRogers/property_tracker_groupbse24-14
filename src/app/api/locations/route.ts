import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { createAuthInstance } from "@/lib/auth";
import { ObjectId } from "mongodb";

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

        const location = {
            ...data,
            userId: session.user.id,
            propertyId: data.propertyId, // Append propertyId to the location
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("locations").insertOne(location);

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to create location" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("property-tracker");

        // Use the URL constructor to parse the request URL
        const url = new URL(req.url);
        const propertyId = url.searchParams.get("propertyId");
        console.log("Location Query PROPERTY ID", propertyId)

        if (!propertyId) {
            return NextResponse.json({ success: false, error: 'No property ID provided' }, { status: 400 });
        }

        const objectId = new ObjectId(propertyId);

        const latestLocation = await db.collection("locations")
            .find({ propertyId: objectId })
            .sort({ createdAt: -1 })
            .limit(1)
            .toArray();

        return NextResponse.json({ success: true, data: latestLocation });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch location data" },
            { status: 500 }
        );
    }
}