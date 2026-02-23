import type { components } from "@schema";
import type { ReactNode } from "react";
import type { ADMINISTRATIVE_DISTRICTS } from "@/app/onBoarding/_constants";

export type OnboardingStep = 0 | 1 | 2;
export type GenderValue = "M" | "F" | "";
export type OnboardingOption = { value: string; label: string };
export type City = keyof typeof ADMINISTRATIVE_DISTRICTS;

export type OnboardingFormData = {
  petName: string;
  breed: string;
  gender: GenderValue;
  birthDate: string;
  city: string;
  district: string;
  diseases: string[];
};

export type OnboardingPayload = components["schemas"]["PetCreateRequest"];

export type OnboardingFormAction = (formData: FormData) => void | Promise<void>;
export type OnboardingFormChangeHandler = (next: Partial<OnboardingFormData>) => void;

export type OnboardingValidationErrors = {
  petName?: string;
  breed?: string;
  gender?: string;
  birthDate?: string;
  city?: string;
  district?: string;
};

export type FormFieldProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

export type OnboardingFormProps = {
  action: OnboardingFormAction;
};

export type OnboardingHeaderProps = {
  title: string;
  onBack?: () => void;
  canGoBack?: boolean;
  className?: string;
};

export type OnboardingProgressProps = {
  percent: number;
  className?: string;
};

export type StepOneFieldsProps = {
  data: OnboardingFormData;
  onChange: OnboardingFormChangeHandler;
  errors?: OnboardingValidationErrors;
  showErrors?: boolean;
};

export type StepTwoFieldsProps = {
  data: OnboardingFormData;
  onChange: OnboardingFormChangeHandler;
  errors?: OnboardingValidationErrors;
  showErrors?: boolean;
};

export type StepThreeFieldsProps = {
  data: OnboardingFormData;
  onChange: OnboardingFormChangeHandler;
};

export type OnboardingRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
