import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPost = vi.fn();

vi.mock("@/lib/api", () => ({
  client: {
    POST: (...args: unknown[]) => mockPost(...args),
  },
}));

import {
  postAuthLogin,
  postAuthLogout,
  postAuthRefresh,
  postGroupParticipate,
} from "@/api/server/authApi";

describe("server/authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("postAuthLogout: refreshToken cookie로 로그아웃 요청을 보낸다", async () => {
    mockPost.mockResolvedValue({});

    await expect(postAuthLogout("refresh-token")).resolves.toBeUndefined();
    expect(mockPost).toHaveBeenCalledWith("/api/auth/logout", {
      params: {
        cookie: {
          refreshToken: "refresh-token",
        },
      },
    });
  });

  it("postAuthLogin: 응답의 data와 response를 반환한다", async () => {
    const response = new Response(null, { status: 200 });
    const data = { accessToken: "new-access-token" };
    mockPost.mockResolvedValue({ data, response });

    await expect(postAuthLogin("google-access-token", null)).resolves.toEqual({ data, response });
    expect(mockPost).toHaveBeenCalledWith("/api/auth/login", {
      body: { accessToken: "google-access-token", inviteUrl: undefined },
    });
  });

  it("postAuthRefresh: response를 그대로 반환한다", async () => {
    const response = new Response(null, { status: 200 });
    mockPost.mockResolvedValue({ response });

    await expect(postAuthRefresh("access-token", "refresh-token")).resolves.toBe(response);
    expect(mockPost).toHaveBeenCalledWith("/api/auth/refresh", {
      body: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      },
    });
  });

  it("postGroupParticipate: authorization이 있으면 헤더를 포함한다", async () => {
    mockPost.mockResolvedValue({});

    await expect(postGroupParticipate("invite-url", "Bearer token")).resolves.toBeUndefined();
    expect(mockPost).toHaveBeenCalledWith("/api/group/participate", {
      body: { inviteUrl: "invite-url" },
      headers: { Authorization: "Bearer token" },
    });
  });

  it("postGroupParticipate: authorization이 없으면 헤더를 생략한다", async () => {
    mockPost.mockResolvedValue({});

    await expect(postGroupParticipate("invite-url")).resolves.toBeUndefined();
    expect(mockPost).toHaveBeenCalledWith("/api/group/participate", {
      body: { inviteUrl: "invite-url" },
      headers: undefined,
    });
  });
});
