import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DUMMY_GEOFENCE = [
    { lat: 0.3480, lng: 32.5828 },
    { lat: 0.3490, lng: 32.5840 },
    { lat: 0.3470, lng: 32.5850 },
    { lat: 0.3460, lng: 32.5835 },
]
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const property = url.searchParams.get("property");

    if (!property) {
      return NextResponse.json({ message: "Property is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("property-tracking"); //the name of the db

    const geofence = await db.collection("geofences").findOne({ property });

    if (!geofence) {
        console.warn(`Geofence not found for ${property}. Using dummy data.`);
      return NextResponse.json({ coordinates: DUMMY_GEOFENCE }, { status: 200 });
    }

    // return NextResponse.json({ coordinates: geofence.coordinates }, { status: 200 });
      return NextResponse.json({ coordinates: DUMMY_GEOFENCE }, { status: 200 });


  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

//getting the property

export async function DELETE(request: Request) {
  try {
    const { property } = await request.json();

    if (!property) {
      return NextResponse.json({ message: "Property is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("geofencing");

    const result = await db.collection("geofences").deleteOne({ property });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Geofence not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Geofence deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// export async function POST(request: Request) {
//   try {
//     const { property, coordinates } = await request.json();

//     if (!property || !coordinates || !Array.isArray(coordinates)) {
//       return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 });
//     }

//     const client = await clientPromise;
//     const db = client.db("geofencing");

//     // Check if geofence already exists
//     const existingGeofence = await db.collection("geofences").findOne({ property });
//     if (existingGeofence) {
//       return NextResponse.json({ message: "Geofence already exists" }, { status: 409 });
//     }

//     const newGeofence = {
//       property,
//       coordinates,
//       createdAt: new Date(),
//     };

//     const result = await db.collection("geofences").insertOne(newGeofence);
//     return NextResponse.json({ message: "Geofence created successfully", geofenceId: result.insertedId }, { status: 201 });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

//getting geofence
