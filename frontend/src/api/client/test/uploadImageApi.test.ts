import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPatch = vi.fn();

vi.mock("@/api/lib/client", () => ({
  client: {
    PATCH: (...args: unknown[]) => mockPatch(...args),
  },
}));

vi.mock("@vercel/blob", () => ({
  put: vi.fn(),
}));

import { updateImageUrl } from "@/api/client/uploadImageApi";

describe("updateImageUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("정상 응답이면 업데이트된 URL을 반환한다", async () => {
    mockPatch.mockResolvedValue({
      data: { memberImageUrl: "https://blob.vercel-storage.com/new-image.png" },
    });

    await expect(updateImageUrl("https://blob.vercel-storage.com/new-image.png")).resolves.toEqual({
      ok: true,
      url: "https://blob.vercel-storage.com/new-image.png",
    });
  });

  it("응답 데이터가 없으면 실패를 반환한다", async () => {
    mockPatch.mockResolvedValue({ data: null });

    await expect(updateImageUrl("https://blob.vercel-storage.com/new-image.png")).resolves.toEqual({
      ok: false,
      error: "이미지 URL 업데이트에 실패했습니다.",
    });
  });

  it("응답 URL 타입이 문자열이 아니면 실패를 반환한다", async () => {
    mockPatch.mockResolvedValue({ data: { memberImageUrl: null } });

    await expect(updateImageUrl("https://blob.vercel-storage.com/new-image.png")).resolves.toEqual({
      ok: false,
      error: "이미지 URL 업데이트에 실패했습니다.",
    });
  });

  it("예외 발생 시 에러 메시지로 실패를 반환한다", async () => {
    mockPatch.mockRejectedValue(new Error("프로필 이미지 변경 실패"));

    await expect(updateImageUrl("https://blob.vercel-storage.com/new-image.png")).resolves.toEqual({
      ok: false,
      error: "프로필 이미지 변경 실패",
    });
  });
});
