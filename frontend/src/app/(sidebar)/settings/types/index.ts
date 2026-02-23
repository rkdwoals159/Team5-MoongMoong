import type { MemberInfoResponse } from "@/api/types/settingsApi.type";
import type { GetPetInfoResponse } from "@/api/types/perInfoApi.type";
import type { DiseaseCode } from "@/api/types/forecastApi.type";
import type { DogBreedCode } from "@/constants";

export type SettingsTab = "account" | "dog";

export type AccountSettingsSectionProps = {
  account: MemberInfoResponse;
  onClose?: () => void;
};

export type DogSettingsSectionProps = {
  dog: GetPetInfoResponse;
  onClose?: () => void;
};

export type NavItem = {
  id: SettingsTab;
  label: string;
};

export type SettingsManageModalViewProps = {
  currentTab: SettingsTab;
  account: MemberInfoResponse | null;
  dog: GetPetInfoResponse | null;
};

export type SettingsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export type DogFormValues = {
  petName: string;
  breed: DogBreedCode;
  gender: "M" | "F";
  birthDate: string;
  district: string;
  diseases: DiseaseCode[];
};
