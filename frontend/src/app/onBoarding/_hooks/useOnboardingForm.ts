"use client";

import { useRef, useState } from "react";
import type { RefObject, SyntheticEvent } from "react";

import {
  DEFAULT_FORM_DATA,
  LAST_STEP,
  ONBOARDING_INITIAL_STEP_ERROR_STATE,
} from "@/app/onBoarding/_constants";
import type { OnboardingFormData, OnboardingStep } from "@/app/onBoarding/_types";
import {
  getProgressPercent,
  getStepValidationErrors,
  hasStepValidationErrors,
  toError,
} from "@/app/onBoarding/_utils";
import { useErrorBoundary } from "@/hooks/useErrorBoundary";

import { useOnboardingCarousel } from "./useOnboardingCarousel";

export function useOnboardingForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<OnboardingFormData>(DEFAULT_FORM_DATA);
  const [showErrorsByStep, setShowErrorsByStep] = useState<Record<OnboardingStep, boolean>>(
    ONBOARDING_INITIAL_STEP_ERROR_STATE,
  );
  const { emblaRef, step, goToStep } = useOnboardingCarousel();
  const { showErrorBoundary } = useErrorBoundary();

  const validationErrors = getStepValidationErrors(formData);
  const isLastStep = step === LAST_STEP;
  const primaryLabel = isLastStep
    ? formData.diseases.length > 0
      ? "저장하기"
      : "건너뛰기"
    : "다음";

  const progressPercent = getProgressPercent(step);

  const handleChange = (next: Partial<OnboardingFormData>) => {
    setFormData((current) => ({ ...current, ...next }));
  };

  const setCurrentStepErrorState = (isVisible: boolean): void => {
    setShowErrorsByStep((current) =>
      current[step] === isVisible
        ? current
        : {
            ...current,
            [step]: isVisible,
          },
    );
  };

  const moveNextStep = () => {
    if (hasStepValidationErrors(step, validationErrors)) {
      setCurrentStepErrorState(true);
      return;
    }

    setCurrentStepErrorState(false);

    if (!isLastStep) {
      goToStep((step + 1) as OnboardingStep);
    }
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    try {
      if (!isLastStep) {
        event.preventDefault();
        moveNextStep();
      }
    } catch (error) {
      showErrorBoundary(toError(error));
    }
  };

  const handlePrimaryButtonClick = () => {
    try {
      if (isLastStep) {
        formRef.current?.requestSubmit();
        return;
      }
      moveNextStep();
    } catch (error) {
      showErrorBoundary(toError(error));
    }
  };

  return {
    formRef: formRef as RefObject<HTMLFormElement>,
    formData,
    showErrorsByStep,
    step,
    goToStep,
    emblaRef,
    isLastStep,
    primaryLabel,
    progressPercent,
    handleSubmit,
    handlePrimaryButtonClick,
    handleChange,
    validationErrors,
  } as const;
}
