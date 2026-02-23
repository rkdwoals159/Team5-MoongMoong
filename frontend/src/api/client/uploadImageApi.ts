"use server";

import { client } from "@/lib/api";
import { put } from "@vercel/blob";
import type { UploadPetImageResult } from "@/api/types/uploadImageApi.type";
import {
  validateImageFile,
  getCurrentImageUrlFromFormData,
  buildBlobPathname,
  deleteBlobIfNeeded,
  DEFAULT_IMAGE_VALIDATION_OPTIONS,
} from "@/api/utils/uploadImageApi.util";

/**
 * Server Action: 기존 Blob 이미지(있으면) 삭제 후, 새 이미지를 Vercel Blob에 업로드하고 public URL을 반환합니다.
 * BLOB_READ_WRITE_TOKEN 환경 변수가 필요합니다.
 * @param formData 업로드할 이미지 파일 (key: "file"). 선택적으로 "currentImageUrl"로 기존 이미지 URL 전달.
 * @returns {Promise<UploadPetImageResult>} 업로드 결과
 */
export async function uploadImageToVercel(formData: FormData): Promise<UploadPetImageResult> {
  const file = formData.get("file") as File | null;
  if (!file || !(file instanceof File)) {
    return { ok: false, error: "파일이 없습니다." };
  }

  const validationError = validateImageFile(file, DEFAULT_IMAGE_VALIDATION_OPTIONS);
  if (validationError) return validationError;

  const urlToDelete = getCurrentImageUrlFromFormData(formData);
  if (urlToDelete) {
    await deleteBlobIfNeeded(urlToDelete);
  }

  try {
    const pathname = buildBlobPathname(file);
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return { ok: true, url: blob.url };
  } catch (e) {
    console.error("uploadImageToVercel error:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "이미지 업로드에 실패했습니다.",
    };
  }
}

/**
 * Server Action: 이미지 URL을 업데이트합니다.
 * @param url 업데이트할 이미지 URL
 * @returns 업데이트 결과 (성공 시 url, 실패 시 error)
 */
export async function updateImageUrl(url: string): Promise<UploadPetImageResult> {
  try {
    const { data } = await client.PATCH(`/api/member/profile`, {
      body: { memberImageUrl: url },
    });
    if (!data) {
      return { ok: false, error: "이미지 URL 업데이트에 실패했습니다." };
    }
    const updatedUrl = data.memberImageUrl;
    if (typeof updatedUrl !== "string") {
      return { ok: false, error: "이미지 URL 업데이트에 실패했습니다." };
    }
    return { ok: true, url: updatedUrl };
  } catch (e) {
    console.error("updateImageUrl error:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "이미지 URL 업데이트에 실패했습니다.",
    };
  }
}
