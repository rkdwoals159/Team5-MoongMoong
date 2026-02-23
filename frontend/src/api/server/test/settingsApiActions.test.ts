import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { API_ERROR_MESSAGES } from "@/api/constants";
import { updateMemberName, updatePetInfo } from "@/api/server/settingsApiActions";

const fetchMock = vi.fn();
const originalFetch = global.fetch;

describe("settingsApiActions", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("updateMemberName: 성공 시 응답 데이터를 반환한다", async () => {
    const payload = { memberName: "멍멍이", memberEmail: "test@example.com" };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(payload), { status: 200 }));

    await expect(updateMemberName("멍멍이")).resolves.toEqual(payload);
  });

  it("updateMemberName: 실패 시 응답 message를 throw한다", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "닉네임 형식이 올바르지 않습니다." }), {
        status: 400,
      }),
    );

    await expect(updateMemberName("")).rejects.toThrow("닉네임 형식이 올바르지 않습니다.");
  });

  it("updatePetInfo: 실패 응답 본문이 없으면 기본 메시지를 throw한다", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 500 }));

    await expect(updatePetInfo({} as never)).rejects.toThrow(API_ERROR_MESSAGES.DEFAULT);
  });

  it("updatePetInfo: 성공이지만 본문이 없으면 기본 메시지를 throw한다", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 200 }));

    await expect(updatePetInfo({} as never)).rejects.toThrow(API_ERROR_MESSAGES.DEFAULT);
  });
});
