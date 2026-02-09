export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const ACCESS_COOKIE = IS_PRODUCTION ? "__Host-access" : "dev_access";
export const REFRESH_COOKIE = IS_PRODUCTION ? "__Host-refresh" : "dev_refresh";

export const authCookies = {
  access: ACCESS_COOKIE,
  refresh: REFRESH_COOKIE,
};

export const AUTH_DEFAULT_RETURN_TO = "/dashboard";
export const AUTH_LOGIN_PATH = "/login";
export const AUTH_REFRESH_PATH = "/api/auth/refresh";
export const AUTH_CALLBACK_PATH = "/api/auth/callback";

export const GOOGLE_OAUTH_AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
export const GOOGLE_OAUTH_SCOPE = "openid email profile";
export const GOOGLE_OAUTH_ACCESS_TYPE = "offline";
export const GOOGLE_OAUTH_PROMPT = "consent";

export const PROXY_TOKEN_EXPIRY_SKEW_SECONDS = 30;
