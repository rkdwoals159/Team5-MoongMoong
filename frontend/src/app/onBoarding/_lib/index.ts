import { DISEASE_CODE_SHORT_NAMES } from "@/app/(sidebar)/forecast/_constants";
import { ADMINISTRATIVE_DISTRICTS, BREEDS, DISEASES } from "@/app/onBoarding/_constants";
import type { OnboardingPayload, OnboardingOption } from "@/app/onBoarding/_types";

export const BREED_LABEL_OPTIONS = Object.values(BREEDS);

export const BREED_LABEL_TO_CODE = Object.fromEntries(
  Object.entries(BREEDS).map(([code, label]) => [label, code]),
);

type City = keyof typeof ADMINISTRATIVE_DISTRICTS;

export const CITY_OPTIONS = Object.keys(ADMINISTRATIVE_DISTRICTS) as City[];

export const DISEASE_OPTIONS: OnboardingOption[] = DISEASES.map((code) => ({
  value: code,
  label: DISEASE_CODE_SHORT_NAMES[code as keyof typeof DISEASE_CODE_SHORT_NAMES] ?? code,
}));

function isCity(city: string): city is City {
  return city in ADMINISTRATIVE_DISTRICTS;
}

export function getDistrictOptions(city: string): string[] {
  if (!isCity(city)) {
    return [];
  }

  return ADMINISTRATIVE_DISTRICTS[city] ?? [];
}

export function getToggledDiseaseCodes(diseases: string[], code: string): string[] {
  return diseases.includes(code)
    ? diseases.filter((disease) => disease !== code)
    : [...diseases, code];
}

function readFormValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

export function mapFormDataToPetPayload(formData: FormData): OnboardingPayload {
  const breedLabel = readFormValue(formData, "breed");

  return {
    petName: readFormValue(formData, "petName"),
    breed: BREED_LABEL_TO_CODE[breedLabel] ?? breedLabel,
    gender: readFormValue(formData, "gender"),
    birthDate: readFormValue(formData, "birthDate"),
    city: readFormValue(formData, "city"),
    district: readFormValue(formData, "district"),
    diseases: formData.getAll("diseases").map(String),
  } as OnboardingPayload;
}
