import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/app/api/auth/_constants";

export async function GET() {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const response = await fetch(process.env.NEXT_PUBLIC_SSE_URL!, {
    headers: {
      Accept: "text/event-stream",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok || !response.body) {
    return new Response("SSE 연결 실패", { status: response.status });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
