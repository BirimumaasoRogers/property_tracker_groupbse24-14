import { NextResponse } from "next/server";
import { createAuthInstance } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const auth = await createAuthInstance();
    const response = await auth.handler(request);
    
    if (!response.ok) {
      const error = await response.json();
      if (error.code === 'USER_ALREADY_EXISTS') {
        return NextResponse.json({ message: "User already exists" }, { status: 409 });
      }
      throw error;
    }

    const user = await response.json();
    return NextResponse.json({ message: "User registered successfully", userId: user.id }, { status: 201 });
    
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}