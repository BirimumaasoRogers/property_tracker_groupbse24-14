import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("property-tracker");
        const data = await req.json();

        const property = {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("properties").insertOne(property);

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to create property" },
            { status: 500 }
        );
    }
}