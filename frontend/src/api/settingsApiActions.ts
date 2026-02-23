import type {
  UpdateMemberNameResponse,
  PetUpdateRequest,
  PetUpdateResponse,
  ErrorBody,
} from "@/api/types/settingsApi.type";
import { API_ERROR_MESSAGES } from "@/api/constants";

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

const parseResponseBody = async <T>(response: Response): Promise<T | null> => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

const resolveErrorMessage = (body: unknown, fallbackMessage: string): string => {
  if (!isObjectRecord(body)) return fallbackMessage;
  const message = (body as ErrorBody).message;
  return typeof message === "string" && message.length > 0 ? message : fallbackMessage;
};

const requestSettingsAction = async <T>(
  url: string,
  method: "PATCH" | "PUT",
  body: unknown,
  fallbackMessage: string,
): Promise<T> => {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await parseResponseBody<T | ErrorBody>(response);

  if (!response.ok) {
    throw new Error(resolveErrorMessage(payload, fallbackMessage));
  }

  if (!payload) {
    throw new Error(fallbackMessage);
  }

  return payload as T;
};

// 회원 닉네임 변경
export async function updateMemberName(memberName: string): Promise<UpdateMemberNameResponse> {
  return requestSettingsAction<UpdateMemberNameResponse>(
    "/api/settings/member/name",
    "PATCH",
    { memberName },
    API_ERROR_MESSAGES.DEFAULT,
  );
}

// 반려동물 정보 수정
export async function updatePetInfo(body: PetUpdateRequest): Promise<PetUpdateResponse> {
  return requestSettingsAction<PetUpdateResponse>(
    "/api/settings/pet",
    "PUT",
    body,
    API_ERROR_MESSAGES.DEFAULT,
  );
}
