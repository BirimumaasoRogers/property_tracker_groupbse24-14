import { NextRequest, NextResponse } from "next/server";
import Location from "@/models/Location";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackerId = searchParams.get("trackerId");

    if (!trackerId) {
      return NextResponse.json(
        { success: false, message: "Tracker ID is required" },
        { status: 400 }
      );
    }

    // Use the Location model to find location entries
    const locations = await Location.find({ trackerId }).sort({ timestamp: -1 });

    console.log(`Found ${locations.length} location history records for tracker ${trackerId}`);
    
    return NextResponse.json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching location history:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch location history" },
      { status: 500 }
    );
  }
}