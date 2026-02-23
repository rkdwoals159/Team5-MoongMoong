import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGet = vi.fn();

vi.mock("@/lib/api", () => ({
  client: {
    GET: (...args: unknown[]) => mockGet(...args),
  },
}));

import { getMemberInfoServer } from "@/api/server/settingsApiQueries";

describe("getMemberInfoServer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("정상 응답이면 회원 정보를 반환한다", async () => {
    const member = { memberName: "몽몽이", memberEmail: "mong@example.com" };
    mockGet.mockResolvedValue({ data: member });

    await expect(getMemberInfoServer()).resolves.toEqual(member);
  });

  it("404 ApiHttpError면 null을 반환한다", async () => {
    const notFoundError = Object.assign(new Error("not found"), {
      name: "ApiHttpError",
      status: 404,
    });
    mockGet.mockRejectedValue(notFoundError);

    await expect(getMemberInfoServer()).resolves.toBeNull();
  });

  it("404가 아닌 ApiHttpError는 그대로 throw한다", async () => {
    const serverError = Object.assign(new Error("server error"), {
      name: "ApiHttpError",
      status: 500,
    });
    mockGet.mockRejectedValue(serverError);

    await expect(getMemberInfoServer()).rejects.toBe(serverError);
  });
});
