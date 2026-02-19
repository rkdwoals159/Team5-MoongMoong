export type CallbackEnv = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export type GoogleCallResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      reason: string;
      detail?: unknown;
    };
