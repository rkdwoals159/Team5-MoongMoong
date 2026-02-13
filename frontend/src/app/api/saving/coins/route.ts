import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/api";

export async function POST(request: NextRequest) {
  const { amount } = await request.json();
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ message: "유효하지 않은 금액입니다." }, { status: 400 });
  }
  const { data, error } = await client.POST("/api/group/bank/coins", { body: { amount } });
  if (error || !data || !data.orderId || !data.amount) {
    return NextResponse.json({ message: "결제 요청에 실패했습니다." }, { status: 500 });
  }
  return NextResponse.json(data);
}
