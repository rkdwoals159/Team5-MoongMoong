import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/api";

export async function POST(request: NextRequest) {
  const { code, orderId, message } = await request.json();
  const { error } = await client.POST("/api/group/bank/coins/fail", {
    body: { orderId, code, message },
  });
  if (error) return NextResponse.json({ message: "결제 처리에 실패했습니다." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
