import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("property-tracking");
        const collection = db.collection("items");

        // Fetch the latest tracked item (replace with your query logic)
        const item = await collection.findOne({}, { sort: { _id: -1 } });

        if (!item) {
            return NextResponse.json({ message: "No items found" }, { status: 404 });
        return NextResponse.json({ property: "Bag" }, { status: 500 });

        }

        // return NextResponse.json({ property: item.property }, { status: 200 });
        return NextResponse.json({ property: "Bag" }, { status: 500 });


    } catch (error) {
        console.error("Error fetching property:", error);
        // return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        return NextResponse.json({ property: "Bag" }, { status: 500 });

    }
}
