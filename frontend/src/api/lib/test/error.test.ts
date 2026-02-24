import { describe, expect, it } from "vitest";
import { API_ERROR_MESSAGES } from "@/api/constants";
import { toApiHttpError } from "@/api/lib/error";

const withUrl = (response: Response, url: string): Response => {
  Object.defineProperty(response, "url", {
    value: url,
    configurable: true,
  });
  return response;
};

describe("toApiHttpError", () => {
  it("백엔드 에러코드 메시지를 최우선으로 사용한다", async () => {
    const response = withUrl(
      new Response(JSON.stringify({ code: "NO_SUCH_BANK_FOUND" }), { status: 400 }),
      "https://api.example.com/api/group/bank",
    );

    const error = await toApiHttpError(response);

    expect(error.message).toBe(API_ERROR_MESSAGES.BANK_INFO);
    expect(error.status).toBe(400);
    expect(error.code).toBe("NO_SUCH_BANK_FOUND");
    expect(error.name).toBe("ApiHttpError");
  });

  it("에러코드가 없으면 경로 메시지를 사용한다", async () => {
    const response = withUrl(
      new Response(JSON.stringify({ message: "server error" }), { status: 500 }),
      "https://api.example.com/api/expenses",
    );

    const error = await toApiHttpError(response);

    expect(error.message).toBe(API_ERROR_MESSAGES.EXPENSES);
  });

  it("경로 매핑이 없으면 상태코드 메시지를 사용한다", async () => {
    const response = withUrl(
      new Response(JSON.stringify({ message: "not found" }), { status: 404 }),
      "https://api.example.com/api/unknown",
    );

    const error = await toApiHttpError(response);

    expect(error.message).toBe("요청한 리소스를 찾을 수 없습니다.");
  });

  it("매핑이 모두 없으면 fallback 메시지를 사용한다", async () => {
    const response = withUrl(
      new Response(JSON.stringify({ message: "teapot" }), { status: 418 }),
      "https://api.example.com/api/unknown",
    );

    const error = await toApiHttpError(response, "fallback message");

    expect(error.message).toBe("fallback message");
  });
});
