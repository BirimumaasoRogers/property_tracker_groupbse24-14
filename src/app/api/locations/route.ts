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
        console.log("🔹 Incoming Tracker ID:", data.trackerId);


        const trackerId = data.trackerId.trim();
        // Fetch the property using trackerId
        // const property = await Property.findOne({ trackerId }).lean();
        // if (!property) {
        //     return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
        // }

        const location = new Location({
            trackerId: data.trackerId,
            latitude: data.latitude,
            longitude: data.longitude,
            speed: data.speed,
            timestamp: new Date(),
        });

        console.log("🔹 Location to Save:", location);

        const result = await location.save();
        console.log("✅ Saved Location:", result);

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("❌ Error handling request:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create location" },
            { status: 500 }
        );
    }
}


export async function GET(req: Request) {
    try {
        await connectDB();
        
        const url = new URL(req.url);
        const trackerId = url.searchParams.get("trackerId");
        // console.log("🔹 trackerId:", trackerId); // Log the trackerId for verification
        
        // Also check for propertyId and find the associated trackerId if needed
        if (!trackerId) {
            const propertyId = url.searchParams.get("propertyId");
            console.log("🔹 propertyId fallback:", propertyId);
            
            if (propertyId) {
                // If propertyId is provided but trackerId isn't, look up the property to get its trackerId
                const property = await Property.findById(propertyId);
                if (property && property.trackerID) {
                    console.log("🔹 Found trackerId from propertyId:", property.trackerID);
                    
                    // Now fetch location using the trackerId from the property
                    const latestLocation = await Location.find({ trackerId: property.trackerID })
                        .sort({ createdAt: -1 })
                        .limit(1);
                    
                    return NextResponse.json({ success: true, data: latestLocation });
                }
            }
            
            return NextResponse.json({ success: false, error: 'No tracker ID provided' }, { status: 400 });
        }

        const latestLocation = await Location.find({ trackerId })
            .sort({ createdAt: -1 })
            .limit(1);

        return NextResponse.json({ success: true, data: latestLocation });
    } catch (error) {
        console.error("❌ Error fetching location:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch location data" },
            { status: 500 }
        );
    }
}