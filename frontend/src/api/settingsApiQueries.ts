import { client } from "@/lib/api";
import type { ApiHttpError } from "@/lib/api/type";
import type { MemberInfoResponse } from "@/api/types/settingsApi.type";

const isApiHttpError = (error: unknown): error is ApiHttpError => {
  return (
    error instanceof Error &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  );
};

// 서버 컴포넌트용 - client로 외부 API 직접 호출
// schema의 findMember는 query.member를 요구하나, 실제 백엔드는 로그인 사용자 정보를 반환하므로 생략 가능
export async function getMemberInfoServer(): Promise<MemberInfoResponse | null> {
  try {
    const { data } = await client.GET("/api/member");
    return data ?? null;
  } catch (error) {
    if (isApiHttpError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}
