import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGet = vi.fn();

vi.mock("@/lib/api", () => ({
  client: {
    GET: (...args: unknown[]) => mockGet(...args),
  },
}));

import { getBank } from "@/api/client/savingApi";

describe("getBank", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("정상 응답이면 저금통 정보를 반환한다", async () => {
    const bank = { target: 10000 };
    mockGet.mockResolvedValue({ data: bank });

    await expect(getBank()).resolves.toEqual(bank);
  });

  it("404 ApiHttpError면 null을 반환한다", async () => {
    const notFoundError = Object.assign(new Error("not found"), {
      name: "ApiHttpError",
      status: 404,
    });
    mockGet.mockRejectedValue(notFoundError);

    await expect(getBank()).resolves.toBeNull();
  });

  it("404가 아닌 ApiHttpError는 그대로 throw한다", async () => {
    const serverError = Object.assign(new Error("server error"), {
      name: "ApiHttpError",
      status: 500,
    });
    mockGet.mockRejectedValue(serverError);

    await expect(getBank()).rejects.toBe(serverError);
  });
});
