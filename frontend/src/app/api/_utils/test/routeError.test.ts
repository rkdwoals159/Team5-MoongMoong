import { describe, expect, it } from "vitest";
import { API_ERROR_MESSAGES } from "@/api/constants";
import { toApiRouteErrorResponse } from "@/app/api/_utils/routeError";

describe("toApiRouteErrorResponse", () => {
  it("ApiHttpError는 상태코드와 메시지를 유지한다", async () => {
    const apiError = Object.assign(new Error("기본 메시지"), {
      status: 422,
      body: { message: "유효성 검증 실패" },
    });

    const response = toApiRouteErrorResponse(apiError);
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body).toEqual({ message: "유효성 검증 실패" });
  });

  it("SyntaxError는 400으로 변환한다", async () => {
    const response = toApiRouteErrorResponse(new SyntaxError("Invalid JSON"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ message: "요청 본문 형식이 올바르지 않습니다." });
  });

  it("일반 Error는 500 + 에러 메시지를 반환한다", async () => {
    const response = toApiRouteErrorResponse(new Error("알 수 없는 오류"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ message: "알 수 없는 오류" });
  });

  it("비-Error 예외는 기본 에러 메시지를 반환한다", async () => {
    const response = toApiRouteErrorResponse("unexpected");
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ message: API_ERROR_MESSAGES.DEFAULT });
  });
});
