import type { components } from "@schema";

export type ApiErrorResponse = components["schemas"]["ErrorResponse"];

export type ApiCallResult<TData = unknown> = {
  data?: TData;
  error?: ApiErrorResponse;
  response: Response;
};

export type AuthLoginResponse = components["schemas"]["AuthLoginResponse"];
export type LoginWithGoogleAccessTokenResponse = ApiCallResult<AuthLoginResponse>;
export type ParticipateGroupResponse = ApiCallResult<
  components["schemas"]["PetGroupParticipateResponse"]
>;
export type RefreshAuthTokenResponse = ApiCallResult<
  components["schemas"]["AuthTokenRefreshResponse"]
>;
export type LogoutAuthResponse = ApiCallResult;
