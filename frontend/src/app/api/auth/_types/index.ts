import type { NextResponse } from "next/server";

export type { CallbackEnv, GoogleCallResult } from "./callback";
export type {
  AuthLoginResponse,
  PetCreateRequest,
  PostLoginParams,
  PostLoginResult,
} from "./postLogin";

export type EnvCheck =
  | {
      ok: true;
      value: string;
    }
  | {
      ok: false;
      response: NextResponse;
    };
