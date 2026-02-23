import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGet = vi.fn();
const mockPost = vi.fn();

vi.mock("@/lib/api", () => ({
  client: {
    GET: (...args: unknown[]) => mockGet(...args),
    POST: (...args: unknown[]) => mockPost(...args),
  },
}));

import { getGroupCrew, participateGroup } from "@/app/(sidebar)/family/_api";

describe("family api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getGroupCrew", () => {
    it("정상 응답이면 가족 정보를 반환한다", async () => {
      const crew = [{ memberId: 1, memberName: "몽몽" }];
      mockGet.mockResolvedValue({ data: crew });

      await expect(getGroupCrew()).resolves.toEqual(crew);
    });

    it("응답 데이터가 없으면 에러를 throw한다", async () => {
      mockGet.mockResolvedValue({ data: null });

      await expect(getGroupCrew()).rejects.toThrow("가족 정보를 가져오는데 실패했습니다.");
    });
  });

  describe("participateGroup", () => {
    it("정상 응답이면 data를 반환한다", async () => {
      const payload = { inviteUrl: "https://invite" };
      mockPost.mockResolvedValue({ data: { success: true } });

      await expect(participateGroup(payload.inviteUrl)).resolves.toEqual({
        data: { success: true },
        error: null,
      });
    });

    it("400 ApiHttpError면 에러 메시지를 반환한다", async () => {
      const badRequestError = Object.assign(new Error("초대 코드가 유효하지 않습니다."), {
        name: "ApiHttpError",
        status: 400,
      });
      mockPost.mockRejectedValue(badRequestError);

      await expect(participateGroup("invalid-code")).resolves.toEqual({
        data: null,
        error: "초대 코드가 유효하지 않습니다.",
      });
    });

    it("기타 예외면 기본 실패 메시지로 반환한다", async () => {
      mockPost.mockRejectedValue("unknown");

      await expect(participateGroup("code")).resolves.toEqual({
        data: null,
        error: "가족 참여에 실패했습니다.",
      });
    });
  });
});
