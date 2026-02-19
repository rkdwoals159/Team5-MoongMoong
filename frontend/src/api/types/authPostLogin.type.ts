import type { AuthLoginResponse } from "@/api/types/authApi.type";

export type PostLoginParams = {
  data: AuthLoginResponse | undefined;
  inviteUrl: string | null;
  returnTo: string;
  authorization?: string;
};

export type PostLoginResult =
  | {
      ok: true;
      redirectTo: string;
    }
  | {
      ok: false;
      reason: string;
      detail?: unknown;
    };
