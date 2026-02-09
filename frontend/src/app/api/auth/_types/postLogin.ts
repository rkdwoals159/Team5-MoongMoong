import type { components } from "@schema";

export type PetCreateRequest = components["schemas"]["PetCreateRequest"];
type PetBirthDate = PetCreateRequest["birthDate"];

export type AuthLoginResponse = {
  isInvited?: boolean;
  isNew?: boolean;
  petName?: string | null;
  breed?: PetCreateRequest["breed"] | null;
  gender?: PetCreateRequest["gender"] | null;
  birthDate?: PetBirthDate | null;
};

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
