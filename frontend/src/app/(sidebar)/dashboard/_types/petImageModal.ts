export type PetImageSuccessViewProps = {
  previewUrl: string;
  onCancel: () => void;
  onSave: () => void | Promise<void>;
  isSaving?: boolean;
};

export type PetImageSelectViewProps = {
  onFileSelect: (file: File) => void;
};

export type PetImageErrorViewProps = {
  onRetry: () => void;
};

export type PetImageChangeViewState = "select" | "loading" | "success" | "error";
