import { NextResponse } from "next/server";

export function jsonError(message: string, status = 500) {
  return NextResponse.json({ message }, { status });
}

export async function jsonFromFetch(response: Response, fallbackBody: unknown) {
  const body = await response.json().catch(() => null);
  return NextResponse.json(body ?? fallbackBody, { status: response.status });
}
