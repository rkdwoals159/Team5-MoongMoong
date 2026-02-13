import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/api";

export async function GET() {
  const { data, response, error } = await client.GET("/api/group/bank");
  if (response.status === 404) return NextResponse.json(null, { status: 404 });
  if (error || !data) return NextResponse.json(null, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { target } = await request.json();
  if (!Number.isFinite(target) || target <= 0) {
    return NextResponse.json({ message: "유효하지 않은 목표 금액입니다." }, { status: 400 });
  }
  const { data, error } = await client.POST("/api/group/bank", { body: { target } });
  if (error || !data) return NextResponse.json(null, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const { target } = await request.json();
  if (!Number.isFinite(target) || target <= 0) {
    return NextResponse.json({ message: "유효하지 않은 목표 금액입니다." }, { status: 400 });
  }
  const { data, error } = await client.PATCH("/api/group/bank", { body: { target } });
  if (error || !data) return NextResponse.json(null, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE() {
  const { data, error } = await client.DELETE("/api/group/bank");
  if (error || !data) return NextResponse.json(null, { status: 500 });
  return NextResponse.json(data);
}
