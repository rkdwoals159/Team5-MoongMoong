import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/api";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await client.PUT("/api/pet", { body });
  if (error || !data) return NextResponse.json(null, { status: 500 });
  return NextResponse.json(data);
}
