import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/api";

export async function PATCH(request: NextRequest) {
  const { memberName } = await request.json();
  if (!memberName || typeof memberName !== "string" || memberName.trim() === "") {
    return NextResponse.json({ message: "유효하지 않은 닉네임입니다." }, { status: 400 });
  }
  const { data, error } = await client.PATCH("/api/member/name", {
    body: { memberName },
  });
  if (error || !data) return NextResponse.json(null, { status: 500 });
  return NextResponse.json(data);
}
