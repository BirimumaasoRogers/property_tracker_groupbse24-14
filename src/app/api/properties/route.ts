import { NextResponse } from "next/server";
import { createAuthInstance } from "@/lib/auth";
import Property from "@/models/Property";
import { connectDB } from "@/lib/mongodb";
import ManufacturedDevice from "@/models/ManufacturedDevice";

export async function GET(req: Request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(req.url);
        const trackerId = searchParams.get("trackerId");
        
        if (trackerId) {
            // Special unauthenticated endpoint for hardware lookup
            const property: any = await Property.findOne({ trackerId }).lean();

            if (!property) {
                return NextResponse.json(
                    { success: false, error: "Property not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({ 
                success: true, 
                data: { name: property.name, phone: property.phone, geofence: property.geofence } 
            });
        }

        // Original authenticated endpoint for user's properties
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

        // Check if trackerId is already registered
        const existingProperty = await Property.findOne({ trackerId: data.trackerId });
        if (existingProperty) {
            return NextResponse.json(
                { success: false, error: "This tracker ID has already been registered to another property." },
                { status: 409 }
            );
        }

        // Check if trackerId exists in manufactured devices
        const manufacturedDevice = await ManufacturedDevice.findOne({ trackerId: data.trackerId });
        if (!manufacturedDevice) {
            return NextResponse.json(
                { success: false, error: "This tracker ID does not exist in the list of manufactured devices." },
                { status: 400 }
            );
        }

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


