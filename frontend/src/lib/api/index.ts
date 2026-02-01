import createClient from "openapi-fetch";
import type { paths } from "@schema";

export const defaultHeaders = {
  "Content-Type": "application/json",
  Authorization: process.env.HEADER_AUTHORIZATION,
};

const client = createClient<paths>({
  baseUrl: process.env.BASE_API_URL,
  headers: defaultHeaders,
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    const hasCache = init?.cache;
    return fetch(input, {
      ...init,

      // 기본은 auto no cache(개발환경에서는 캐싱 안되고
      // 프로덕션경에서는 정적 프리렌더로 판단되면 next build 시 1회만 fetch)
      // 개발환경과 프로덕션 환경에서의 캐싱 정책 일치화
      ...(hasCache ? {} : { cache: "no-store" }),
    });
  },
});

export default client;
