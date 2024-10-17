import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);

    // Check if the user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert the new user
    const result = await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered successfully", userId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}