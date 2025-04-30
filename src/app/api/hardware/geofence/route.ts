import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import User from "@/models/User";


function validateTrackerId(trackerId: string): boolean {
    // Matches TRK followed by exactly 3 digits (e.g., TRK001, TRK123)
    const trackerIdRegex = /^TRK\d{3}$/i;
    return trackerIdRegex.test(trackerId);
}

// Restrict to specific domains in production
const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production'
    ? ['http://localhost:3000', 'https://property-tracker-groupbse24-14-565853170463.us-central1.run.app']
    : ['*'];

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const trackerId = url.searchParams.get("trackerId");
        console.log("🔹 Incoming request:", req.method, req.url);

        if (!trackerId || !validateTrackerId(trackerId)) {
            return NextResponse.json(
                { success: false, error: "Invalid tracker ID format" },
                { status: 400 }
            );
        }

        // Fetch property data
        const propertyRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/properties?trackerId=${trackerId}`);
        if (!propertyRes.ok) {
            return NextResponse.json(
                { success: false, error: "Failed to fetch property" },
                { status: propertyRes.status }
            );
        }

        const property = await propertyRes.json();

        // Prepare response
        const response = {
            success: true,
            data: {
                geofence: property.data.geofence.map(
                    ({ lat, lng }: any) => ({ lat, lng })
                ),
            }
        };

        // Secure CORS headers
        const origin = req.headers.get('origin');
        const isAllowed = ALLOWED_ORIGINS.includes(origin || '') || ALLOWED_ORIGINS.includes('*');

        const nextResponse = NextResponse.json(response);
        if (isAllowed) {
            nextResponse.headers.set("Access-Control-Allow-Origin", origin || '*');
        }
        nextResponse.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        nextResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");

        return nextResponse;
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, error: "Service unavailable" },
            { status: 503 }
        );
    }
}

export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });
    // Same CORS logic as GET
    return response;
}