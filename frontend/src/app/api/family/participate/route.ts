import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/api";

export async function POST(request: NextRequest) {
  const { inviteUrl } = await request.json();
  if (!inviteUrl)
    return NextResponse.json({ message: "유효하지 않은 초대 URL입니다." }, { status: 400 });
  const { data, error, response } = await client.POST("/api/group/participate", {
    body: { inviteUrl },
  });

  if (response.status === 400) {
    return NextResponse.json(
      { message: (error as { message?: string })?.message ?? "잘못된 요청입니다." },
      { status: 400 },
    );
  }

  if (error || !data) {
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }

  return NextResponse.json(data);
}
