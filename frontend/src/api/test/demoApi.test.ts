import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGet = vi.fn();

vi.mock("@/lib/api", () => ({
  client: {
    GET: (...args: unknown[]) => mockGet(...args),
  },
}));

import { getDemoReport } from "@/api/demoApi";

describe("getDemoReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("200 응답이면 문자열 '200'을 반환한다", async () => {
    mockGet.mockResolvedValue({ response: { status: 200 } });

    await expect(getDemoReport()).resolves.toBe("200");
  });

  it("200이 아닌 응답이면 빈 문자열을 반환한다", async () => {
    mockGet.mockResolvedValue({ response: { status: 500 } });

    await expect(getDemoReport()).resolves.toBe("");
  });

  it("예외 발생 시 빈 문자열을 반환한다", async () => {
    mockGet.mockRejectedValue(new Error("network error"));

    await expect(getDemoReport()).resolves.toBe("");
  });
});
