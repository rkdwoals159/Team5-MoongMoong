import { describe, expect, it } from "vitest";
import { API_ERROR_MESSAGES } from "@/api/constants";
import { getApiErrorMessageByBackendErrorCode } from "@/api/lib/errorCode";

describe("getApiErrorMessageByBackendErrorCode", () => {
  it("정의된 백엔드 코드면 API 메시지를 반환한다", () => {
    expect(getApiErrorMessageByBackendErrorCode("NO_SUCH_BANK_FOUND")).toBe(
      API_ERROR_MESSAGES.BANK_INFO,
    );
  });

  it("정의되지 않은 코드면 undefined를 반환한다", () => {
    expect(getApiErrorMessageByBackendErrorCode("UNKNOWN_ERROR_CODE")).toBeUndefined();
  });

  it("코드가 문자열이 아니면 undefined를 반환한다", () => {
    expect(getApiErrorMessageByBackendErrorCode(404)).toBeUndefined();
  });
});
