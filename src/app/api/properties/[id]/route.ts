import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import { createAuthInstance } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        const trackerId = params.id;

        if (!trackerId) {
            return NextResponse.json(
                { success: false, error: "Tracker ID is required" },
                { status: 400 }
            );
        }

        const property = await Property.findOne({ trackerId }).lean();

        if (!property) {
            return NextResponse.json(
                { success: false, error: "Property not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: property });
    } catch (error) {
        console.error("Error fetching property:", error);
        return NextResponse.json(
            { success: false, error: "Service unavailable" },
            { status: 503 }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const auth = await createAuthInstance();
        const cookieHeader = req.headers.get('cookie');
        const sessionToken = cookieHeader?.match(/(?:better-auth\.session_token|__Secure-better-auth\.session_token)=([^;]+)/)?.[1];

        if (!sessionToken) {
            return NextResponse.json({ success: false, error: 'No session token found' }, { status: 401 });
        }

        const session = await auth.api.getSession({
            headers: new Headers({
                Cookie: cookieHeader
            })
        });

        if (!session?.session || !session?.user) {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }

        const propertyId = params.id;
        if (!propertyId) {
            return NextResponse.json({ success: false, error: "No propertyId provided" }, { status: 400 });
        }

        let data;
        try {
            data = await req.json();
        } catch (e) {
            return NextResponse.json(
                { success: false, error: "Invalid or empty JSON body" },
                { status: 400 }
            );
        }

        const updated = await Property.findOneAndUpdate(
            { _id: propertyId, userId: session.user.id },
            data,
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ success: false, error: "Property not found or not authorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating property:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update property" },
            { status: 500 }
        );
    }
}