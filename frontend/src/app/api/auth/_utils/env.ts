import type { EnvCheck } from "@/app/api/auth/_types";
import { jsonError } from "./json";

export function requireEnv(value: string | undefined, message: string): EnvCheck {
  if (!value) {
    return { ok: false, response: jsonError(message, 500) };
  }

  return { ok: true, value };
}

export function requireBaseUrl() {
  return requireEnv(process.env.BASE_API_URL, "BASE_API_URL is not configured");
}
