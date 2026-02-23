import { del } from "@vercel/blob";
import {
  MAX_FILE_SIZE_BYTES,
  ALLOWED_IMAGE_TYPES,
  VERCEL_BLOB_HOST,
  DEFAULT_IMAGE_PATH_PREFIX,
} from "@/api/constants";
import type { ValidateImageFileOptions } from "@/api/types/uploadImageApi.type";

/**
 * 이미지 파일 용량·타입 검사. 실패 시 에러 메시지 반환.
 */
export function validateImageFile(
  file: File,
  options: ValidateImageFileOptions,
): { ok: false; error: string } | null {
  const { maxBytes, allowedMimeTypes } = options;
  if (file.size > maxBytes) {
    return { ok: false, error: "파일 용량은 최대 5MB까지 업로드할 수 있습니다." };
  }
  if (!allowedMimeTypes.includes(file.type)) {
    return { ok: false, error: "지원하는 형식은 JPG, PNG, GIF, WEBP입니다." };
  }
  return null;
}

/**
 * FormData에서 currentImageUrl 필드 추출
 */
export function getCurrentImageUrlFromFormData(formData: FormData): string | null {
  const currentImageUrl = formData.get("currentImageUrl");
  return typeof currentImageUrl === "string" && currentImageUrl ? currentImageUrl : null;
}

/**
 * Vercel Blob 저장용 pathname 생성 (images/타임스탬프-랜덤.확장자)
 */
export function buildBlobPathname(file: File): string {
  const ext = file.name.split(".").pop() ?? "jpg";
  return `images/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
}

export function isVercelBlobUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname.endsWith(VERCEL_BLOB_HOST);
  } catch {
    return false;
  }
}

/** 기본 강아지 이미지(공용)는 삭제하지 않음 */
export function isDefaultImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.pathname.includes(DEFAULT_IMAGE_PATH_PREFIX);
  } catch {
    return false;
  }
}

/**
 * Vercel Blob URL이면서 기본 이미지가 아니면 삭제. 실패 시 로그만 남기고 예외는 던지지 않음.
 */
export async function deleteBlobIfNeeded(url: string): Promise<void> {
  if (!isVercelBlobUrl(url) || isDefaultImageUrl(url)) return;
  try {
    await del(url);
  } catch (e) {
    console.warn("deleteBlobIfNeeded: 기존 이미지 삭제 실패(무시)", e);
  }
}

/** 이미지 업로드 검증에 쓸 기본 옵션 (api/constants 기준) */
export const DEFAULT_IMAGE_VALIDATION_OPTIONS: ValidateImageFileOptions = {
  maxBytes: MAX_FILE_SIZE_BYTES,
  allowedMimeTypes: ALLOWED_IMAGE_TYPES,
};
