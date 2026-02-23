"use client";

import { useState } from "react";
import ClientModal from "@/components/ui/Modal/ClientModal";
import CloseIcon from "@/assets/icons/components/close.svg";
import PetImageSelectView from "./PetImageSelectView";
import PetImageLoadingView from "./PetImageLoadingView";
import PetImageSuccessView from "./PetImageSuccessView";
import PetImageErrorView from "./PetImageErrorView";
import { ARIA_LABEL_BY_VIEW, SAVE_DELAY_MS } from "@/app/(sidebar)/dashboard/_constants";
import type { PetImageChangeViewState } from "@/app/(sidebar)/dashboard/_types";
import { uploadImageToVercel, updateImageUrl } from "@/api/client/uploadImageApi";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { MAX_FILE_SIZE_BYTES } from "@/api/constants";

export default function PetImageChangeModal({
  open,
  onClose,
  onImageChange,
  currentImageUrl,
}: {
  open: boolean;
  onClose: () => void;
  onImageChange: (url: string) => void;
  currentImageUrl?: string;
}) {
  const [viewState, setViewState] = useState<PetImageChangeViewState>("select");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const resetModalState = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setViewState("select");
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleOverlayClose = () => {
    resetModalState();
    onClose();
  };

  const handleRetry = () => {
    resetModalState();
  };

  const handleCancelInSuccess = () => {
    resetModalState();
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (currentImageUrl) {
      formData.append("currentImageUrl", currentImageUrl);
    }

    const result = await uploadImageToVercel(formData);

    if (result.ok) {
      const updateResult = await updateImageUrl(result.url);
      if (updateResult.ok) {
        handleOverlayClose();
        onImageChange(result.url);
      } else {
        showToast({
          variant: "error",
          message: updateResult.error ?? "이미지 URL 저장에 실패했습니다.",
        });
      }
    } else {
      showToast({ variant: "error", message: result.error });
    }
    setIsSaving(false);
  };

  const handleFileSelect = async (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      showToast({ variant: "error", message: "파일 용량은 최대 5MB까지 업로드할 수 있습니다." });
      return;
    }

    setSelectedFile(file);
    setViewState("loading");

    // 2500ms 대기
    await new Promise((resolve) => setTimeout(resolve, SAVE_DELAY_MS));

    const url = URL.createObjectURL(file);
    const img = new window.Image();

    img.onload = () => {
      setPreviewUrl(url);
      setViewState("success");
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      setViewState("error");
    };

    img.src = url;
  };

  return (
    <ClientModal
      open={open}
      onClose={handleOverlayClose}
      ariaLabel={ARIA_LABEL_BY_VIEW[viewState]}
      contentClassName="flex max-w-[35rem] min-h-[36rem] flex-col px-700 py-1100"
    >
      <div className="relative flex min-h-0 flex-1 flex-col gap-300 px-700">
        <button
          type="button"
          onClick={handleOverlayClose}
          className="self-end text-gray-400 transition-colors hover:text-gray-700 cursor-pointer"
          aria-label="닫기"
        >
          <CloseIcon className="size-5" aria-hidden="true" />
        </button>
        <div className="flex min-h-0 flex-1 flex-col">
          {viewState === "select" && <PetImageSelectView onFileSelect={handleFileSelect} />}
          {viewState === "loading" && <PetImageLoadingView />}
          {viewState === "success" && previewUrl && (
            <PetImageSuccessView
              previewUrl={previewUrl}
              onCancel={handleCancelInSuccess}
              onSave={handleSave}
              isSaving={isSaving}
            />
          )}
          {viewState === "error" && <PetImageErrorView onRetry={handleRetry} />}
        </div>
      </div>
    </ClientModal>
  );
}
