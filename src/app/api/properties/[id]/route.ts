import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";

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