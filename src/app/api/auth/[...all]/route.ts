import { createAuthInstance } from "@/lib/auth"; // Import the function
import { toNextJsHandler } from "better-auth/next-js";

export const handler = async () => {
  const auth = await createAuthInstance(); // Await the auth instance
  return toNextJsHandler(auth);
};

export const GET = async (req: Request) => {
  const { GET } = await handler();
  return GET(req);
};

export const POST = async (req: Request) => {
  const { POST } = await handler();
  return POST(req);
};