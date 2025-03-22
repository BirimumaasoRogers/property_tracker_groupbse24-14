import { NextResponse } from "next/server";
import { createAuthInstance } from "@/lib/auth";
import Location from "@/models/Location";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function POST(req: Request) {
    try {
        await connectDB();

        console.log("🔹 Incoming request:", req.method, req.url);

        const url = new URL(req.url);
        const apiKey = url.searchParams.get("apiKey"); // Extract API key from URL

        console.log("🔹 Extracted API Key:", apiKey);
        console.log("🔹 Expected API Key:", process.env.TRACKER_API_KEY);

        if (apiKey !== process.env.TRACKER_API_KEY) {
            console.log("❌ Unauthorized request!");
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        const data = await req.json();
        console.log("🔹 Received Data:", data);

        // Fetch the property using trackerId
        const property = await Property.findOne({ trackerID: data.trackerId });
        if (!property) {
            return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
        }

        const location = new Location({
            trackerId: data.trackerId,
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: new Date(),
        });

        console.log("🔹 Location to Save:", location);

        const result = await location.save();
        console.log("✅ Saved Location:", result);

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("❌ Error handling request:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create location" },
            { status: 500 }
        );
    }
}


export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const trackerId = url.searchParams.get("trackerId");

        if (!trackerId) {
            return NextResponse.json({ success: false, error: 'No tracker ID provided' }, { status: 400 });
        }

        const latestLocation = await Location.find({ trackerId })
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