import { createAuthInstance } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Create a reusable function to get the handler
async function getHandler() {
  const auth = await createAuthInstance();
  return toNextJsHandler(auth);
}

export async function GET(req: Request) {
  const handler = await getHandler();
  const response = await handler.GET(req);

  // Add CORS headers
  response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_APP_URL || "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
}

export async function POST(req: Request) {
  const handler = await getHandler();
  const response = await handler.POST(req);

  // Add CORS headers
  response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_APP_URL || "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
}