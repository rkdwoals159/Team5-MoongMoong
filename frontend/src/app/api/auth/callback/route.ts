import { NextRequest } from "next/server";

import { handleAuthCallback } from "@/app/api/auth/_lib/callback";

export async function GET(request: NextRequest) {
  return handleAuthCallback(request);
}
