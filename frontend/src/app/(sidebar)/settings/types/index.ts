import { DiseaseCode } from "@/api/types/forecastApi.type";

export type SettingsTab = "account" | "dog";

export type AccountSettings = {
  email: string;
  nickname: string;
};

export type DogSettings = {
  petName: string;
  breed: string;
  gender: "M" | "F";
  birthDate: string;
  city: string;
  district: string;
  diseases: DiseaseCode[];
};

export type SettingsManageModalViewProps = {
  currentTab: SettingsTab;
};

export type AccountSettingsSectionProps = {
  account: AccountSettings;
};

export type DogSettingsSectionProps = {
  dog: DogSettings;
};

export type NavItem = {
  id: SettingsTab;
  label: string;
};
