import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { name, email, password, phone } = await request.json();

        if (!name || !email || !password || !phone) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const newUser = new User({ name, email, password, phone });
        console.log("NEW USER", newUser)
        await newUser.save();

        return NextResponse.json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
    }
}