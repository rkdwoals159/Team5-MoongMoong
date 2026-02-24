import { NextRequest, NextResponse } from "next/server";
import { client } from "@/api/lib/client";
import { toApiRouteErrorResponse } from "@/app/api/_utils/routeError";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = await client.PUT("/api/pet", { body });
    if (!data) {
      throw new Error("반려동물 정보 수정 응답이 없습니다.");
    }
    return NextResponse.json(data);
  } catch (error) {
    return toApiRouteErrorResponse(error);
  }
}
