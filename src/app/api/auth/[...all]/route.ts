import { createAuthInstance } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Create a reusable function to get the handler
async function getHandler() {
  const auth = await createAuthInstance();
  return toNextJsHandler(auth);
}

export async function GET(req: Request) {
  const handler = await getHandler();
  return handler.GET(req);
}

export async function POST(req: Request) {
  const handler = await getHandler();
  return handler.POST(req);
}