import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/api";

export async function POST(request: NextRequest) {
  const { paymentKey, orderId, amount } = await request.json();
  const { data, error } = await client.POST("/api/group/bank/coins/confirm", {
    body: { paymentKey, orderId, amount },
  });
  if (error || !data || data.amount !== amount || !data.coinId || !data.createdAt || !data.name) {
    return NextResponse.json({ message: "결제 확인에 실패했습니다." }, { status: 500 });
  }
  return NextResponse.json(data);
}
