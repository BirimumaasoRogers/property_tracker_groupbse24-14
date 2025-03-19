import { NextResponse } from "next/server";
import { createAuthInstance } from "@/lib/auth";
import Location from "@/models/Location";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
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

        const data = await req.json();

        const location = new Location({
            ...data,
            userId: session.user.id,
        });

        const result = await location.save();

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
        const url = new URL(req.url);
        const propertyId = url.searchParams.get("propertyId");

        if (!propertyId) {
            return NextResponse.json({ success: false, error: 'No property ID provided' }, { status: 400 });
        }

        const latestLocation = await Location.find({ propertyId })
            .sort({ createdAt: -1 })
            .limit(1);

        return NextResponse.json({ success: true, data: latestLocation });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch location data" },
            { status: 500 }
        );
    }
}