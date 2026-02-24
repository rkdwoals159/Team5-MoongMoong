import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGet = vi.fn();
const mockPost = vi.fn();

vi.mock("@/api/lib/client", () => ({
  client: {
    GET: (...args: unknown[]) => mockGet(...args),
    POST: (...args: unknown[]) => mockPost(...args),
  },
}));

import { getPetInfo, postCreatePet } from "@/api/server/petApi";

describe("petApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPetInfo", () => {
    it("정상 응답이면 반려동물 정보를 반환한다", async () => {
      const pet = { petName: "몽몽" };
      mockGet.mockResolvedValue({ data: pet });

      await expect(getPetInfo()).resolves.toEqual(pet);
    });

    it("예외 발생 시 null을 반환한다", async () => {
      mockGet.mockRejectedValue(new Error("network error"));

      await expect(getPetInfo()).resolves.toBeNull();
    });
  });

  describe("postCreatePet", () => {
    it("정상 응답이면 생성 결과를 반환한다", async () => {
      const createdPet = { petName: "멍멍", petKind: "DOG", petBreed: "믹스" };
      mockPost.mockResolvedValue({ data: createdPet });

      await expect(postCreatePet({} as never)).resolves.toEqual(createdPet);
    });

    it("응답 데이터가 없으면 에러를 throw한다", async () => {
      mockPost.mockResolvedValue({ data: null });

      await expect(postCreatePet({} as never)).rejects.toThrow(
        "반려동물 정보를 저장하지 못했어요.",
      );
    });

    it("클라이언트 예외는 그대로 throw한다", async () => {
      const apiError = Object.assign(new Error("요청 실패"), { status: 500 });
      mockPost.mockRejectedValue(apiError);

      await expect(postCreatePet({} as never)).rejects.toBe(apiError);
    });
  });
});
