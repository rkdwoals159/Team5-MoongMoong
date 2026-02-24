import { cookies } from "next/headers";

import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "@schema";
import { API_ERROR_MESSAGES } from "@/api/constants";
import { ACCESS_COOKIE } from "@/app/api/auth/_constants";
import { toApiHttpError } from "@/api/lib/error";
import type { ApiHttpError } from "@/api/lib/type";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const createBaseClient = () =>
  createClient<paths>({
    baseUrl: process.env.BASE_API_URL,
    headers: defaultHeaders,
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const hasCache = init?.cache;
      const mergedHeaders = new Headers(
        init?.headers ?? (input instanceof Request ? input.headers : undefined),
      );
      if (process.env.LHCI === "true" && process.env.LHCI_TEST_AUTH) {
        mergedHeaders.set("Authorization", process.env.LHCI_TEST_AUTH);
      }
      return fetch(input, {
        ...init,
        headers: mergedHeaders,
        // 기본은 auto no cache(개발환경에서는 캐싱 안되고
        // 프로덕션경에서는 정적 프리렌더로 판단되면 next build 시 1회만 fetch)
        // 개발환경과 프로덕션 환경에서의 캐싱 정책 일치화
        ...(hasCache ? {} : { cache: "no-store" }),
      });
    },
  });

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_COOKIE)?.value;
    if (!token || request.headers.has("Authorization")) {
      return request;
    }

    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return new Request(request, { headers });
  },
};

const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    if (response.ok) return response;
    throw await toApiHttpError(response);
  },
  onError({ error }) {
    if (error instanceof Error) throw error;
    throw new Error(API_ERROR_MESSAGES.DEFAULT);
  },
};

export const client = createBaseClient();
client.use(authMiddleware, errorMiddleware);

export async function safeServerFetch<T>(fetcher: () => Promise<T>): Promise<T | ApiHttpError> {
  try {
    return await fetcher();
  } catch (e) {
    if (e instanceof Error) return e as ApiHttpError;
    throw e;
  }
}
