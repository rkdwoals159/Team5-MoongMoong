import { STEP_COUNT } from "@/app/onBoarding/_constants";
import {
  BIRTH_DATE_MAX_LENGTH,
  ONBOARDING_BIRTH_DATE_REGEXP,
  ONBOARDING_FIELD_ERROR_MESSAGES,
} from "@/app/onBoarding/_constants";
import type {
  OnboardingFormData,
  OnboardingStep,
  OnboardingValidationErrors,
} from "@/app/onBoarding/_types";

export function getProgressPercent(step: OnboardingStep): number {
  return Math.min(100, Math.floor(((step + 1) / STEP_COUNT) * 100));
}

export function isFutureBirthDate(value: string): boolean {
  const [yearStr, monthStr] = value.split("-");
  if (!yearStr || !monthStr) return false;

  const year = Number(yearStr);
  const month = Number(monthStr);
  if (Number.isNaN(year) || Number.isNaN(month)) {
    return false;
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return year > currentYear || (year === currentYear && month > currentMonth);
}

export function normalizeBirthDate(input: string): string {
  const digitsOnly = input.replace(/\D/g, "");
  const truncated = digitsOnly.slice(0, BIRTH_DATE_MAX_LENGTH);
  return truncated.length > 4 ? `${truncated.slice(0, 4)}-${truncated.slice(4)}` : truncated;
}

export function getStepValidationErrors(data: OnboardingFormData): OnboardingValidationErrors {
  const errors: OnboardingValidationErrors = {};

  if (!data.petName.trim()) {
    errors.petName = ONBOARDING_FIELD_ERROR_MESSAGES.PET_NAME_REQUIRED;
  }

  if (!data.breed.trim()) {
    errors.breed = ONBOARDING_FIELD_ERROR_MESSAGES.BREED_REQUIRED;
  }

  if (!data.gender) {
    errors.gender = ONBOARDING_FIELD_ERROR_MESSAGES.GENDER_REQUIRED;
  }

  if (!data.birthDate.trim()) {
    errors.birthDate = ONBOARDING_FIELD_ERROR_MESSAGES.BIRTH_DATE_REQUIRED;
  } else if (!ONBOARDING_BIRTH_DATE_REGEXP.test(data.birthDate.trim())) {
    errors.birthDate = ONBOARDING_FIELD_ERROR_MESSAGES.BIRTH_DATE_INVALID;
  } else if (isFutureBirthDate(data.birthDate.trim())) {
    errors.birthDate = ONBOARDING_FIELD_ERROR_MESSAGES.FUTURE_BIRTH_DATE;
  }

  if (!data.city.trim()) {
    errors.city = ONBOARDING_FIELD_ERROR_MESSAGES.CITY_REQUIRED;
  }

  if (!data.district.trim()) {
    errors.district = ONBOARDING_FIELD_ERROR_MESSAGES.DISTRICT_REQUIRED;
  }

  return errors;
}

export function hasStepValidationErrors(
  step: OnboardingStep,
  errors: OnboardingValidationErrors,
): boolean {
  if (step === 0) return Boolean(errors.petName || errors.breed || errors.gender);
  if (step === 1) return Boolean(errors.birthDate || errors.city || errors.district);
  return false;
}

export function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error("알 수 없는 오류가 발생했습니다.");
}
