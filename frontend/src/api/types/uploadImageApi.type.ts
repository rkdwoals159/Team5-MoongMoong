export type UploadPetImageResult = { ok: true; url: string } | { ok: false; error: string };

export type ValidateImageFileOptions = {
  maxBytes: number;
  allowedMimeTypes: readonly string[];
};
