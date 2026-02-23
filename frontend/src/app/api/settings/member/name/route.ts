import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/api";
import { toApiRouteErrorResponse } from "@/app/api/_utils/routeError";

export async function PATCH(request: NextRequest) {
  try {
    const { memberName } = await request.json();
    if (!memberName || typeof memberName !== "string" || memberName.trim() === "") {
      return NextResponse.json({ message: "유효하지 않은 닉네임입니다." }, { status: 400 });
    }

    const { data } = await client.PATCH("/api/member/name", {
      body: { memberName },
    });
    if (!data) {
      throw new Error("닉네임 변경 응답이 없습니다.");
    }
    return NextResponse.json(data);
  } catch (error) {
    return toApiRouteErrorResponse(error);
  }
}
