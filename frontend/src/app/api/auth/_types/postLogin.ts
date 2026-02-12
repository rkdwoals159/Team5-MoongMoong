import type { components } from "@schema";

export type PetCreateRequest = components["schemas"]["PetCreateRequest"];

export type AuthLoginResponse = components["schemas"]["AuthLoginResponse"];

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
