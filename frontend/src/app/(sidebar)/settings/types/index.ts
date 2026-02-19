import type { MemberInfoResponse } from "@/api/types/settingsApi.type";
import type { PetInfoResponse } from "@/api/types/perInfoApi.type";
import { DiseaseCode } from "@/api/types/forecastApi.type";
import type { DogBreedCode } from "@/constants";

export type SettingsTab = "account" | "dog";

export type AccountSettingsSectionProps = {
  account: MemberInfoResponse;
  onClose?: () => void;
};

export type DogSettingsSectionProps = {
  dog: PetInfoResponse;
  onClose?: () => void;
};

export type NavItem = {
  id: SettingsTab;
  label: string;
};

export type SettingsManageModalViewProps = {
  currentTab: SettingsTab;
  account: MemberInfoResponse | null;
  dog: PetInfoResponse | null;
};

export type DogFormValues = {
  petName: string;
  breed: DogBreedCode;
  gender: "M" | "F";
  birthDate: string;
  district: string;
  diseases: DiseaseCode[];
};
