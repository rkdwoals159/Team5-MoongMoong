import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPost = vi.fn();

vi.mock("@/lib/api", () => ({
  client: {
    POST: (...args: unknown[]) => mockPost(...args),
  },
}));

import { postSSEToken } from "@/api/client/sseApi";

describe("postSSEToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("정상 응답이면 connectionToken을 반환한다", async () => {
    mockPost.mockResolvedValue({ data: { connectionToken: "token-123" } });

    await expect(postSSEToken()).resolves.toBe("token-123");
  });

  it("응답 데이터가 없으면 null을 반환한다", async () => {
    mockPost.mockResolvedValue({ data: null });

    await expect(postSSEToken()).resolves.toBeNull();
  });

  it("connectionToken이 비어 있으면 null을 반환한다", async () => {
    mockPost.mockResolvedValue({ data: { connectionToken: "" } });

    await expect(postSSEToken()).resolves.toBeNull();
  });

  it("API 호출 예외가 발생하면 null을 반환한다", async () => {
    mockPost.mockRejectedValue(new Error("network error"));

    await expect(postSSEToken()).resolves.toBeNull();
  });
});
