import { client } from "@/lib/api";
import type { MemberInfoResponse } from "@/api/types/settingsApi.type";

// 서버 컴포넌트용 - client로 외부 API 직접 호출
// schema의 findMember는 query.member를 요구하나, 실제 백엔드는 로그인 사용자 정보를 반환하므로 생략 가능
export async function getMemberInfoServer(): Promise<MemberInfoResponse | null> {
  const { data, response, error } = await client.GET("/api/member");
  if (response.status === 404) return null;
  if (error || !data) throw new Error("회원 정보를 불러오는데 실패했습니다.");
  return data;
}
