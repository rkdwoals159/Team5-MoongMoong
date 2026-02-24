import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateMemberName, updatePetInfo } from "@/api/client/settingsApiActions";

const mockPatch = vi.fn();
const mockPut = vi.fn();

vi.mock("@/api/lib/client", () => ({
  client: {
    PATCH: (...args: unknown[]) => mockPatch(...args),
    PUT: (...args: unknown[]) => mockPut(...args),
  },
}));

describe("settingsApiActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updateMemberName: 성공 시 응답 데이터를 반환한다", async () => {
    const payload = {
      memberId: 1,
      memberName: "멍멍이",
      memberImageUrl: "https://example.com/image.jpg",
    };
    mockPatch.mockResolvedValueOnce({
      data: payload,
      response: new Response(JSON.stringify(payload), { status: 200 }),
    });

    await expect(updateMemberName("멍멍이")).resolves.toEqual(payload);
  });

  it("updateMemberName: 실패 시 상태코드 기반 메시지를 throw한다", async () => {
    mockPatch.mockRejectedValueOnce(new Error("요청 값이 올바르지 않습니다."));

    await expect(updateMemberName("")).rejects.toThrow("요청 값이 올바르지 않습니다.");
  });

  it("updatePetInfo: 실패 응답 본문이 없으면 상태코드 메시지를 throw한다", async () => {
    mockPut.mockRejectedValueOnce(
      new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."),
    );

    await expect(updatePetInfo({} as never)).rejects.toThrow(
      "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    );
  });

  it("updatePetInfo: 성공이지만 본문이 없으면 undefined를 반환한다", async () => {
    mockPut.mockResolvedValueOnce({
      data: undefined,
      response: new Response("", { status: 200 }),
    });

    await expect(updatePetInfo({} as never)).resolves.toBeUndefined();
  });
});
