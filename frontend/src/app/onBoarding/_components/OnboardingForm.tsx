"use client";

import {
  ONBOARDING_CAROUSEL_VIEWPORT_CLASS,
  ONBOARDING_FIELDS,
  ONBOARDING_STEP_CONTAINER_CLASS,
  ONBOARDING_STEP_TITLES,
} from "@/app/onBoarding/_constants";
import type { OnboardingFormProps, OnboardingStep } from "@/app/onBoarding/_types";

import Button from "@/components/common/Button/Button";
import OnboardingHeader from "./OnboardingHeader";
import OnboardingProgress from "./OnboardingProgress";
import StepOneFields from "./StepOneFields";
import StepThreeFields from "./StepThreeFields";
import StepTwoFields from "./StepTwoFields";
import { useOnboardingForm } from "@/app/onBoarding/_hooks/useOnboardingForm";
import { validateForm } from "../_utils";

const STEP_COMPONENTS = [StepOneFields, StepTwoFields, StepThreeFields] as const;

export default function OnboardingForm({ action }: OnboardingFormProps) {
  const {
    formRef,
    formData,
    step,
    goToStep,
    emblaRef,
    isLastStep,
    primaryLabel,
    progressPercent,
    showErrorsByStep,
    handleSubmit,
    handlePrimaryButtonClick,
    handleChange,
    validationErrors,
  } = useOnboardingForm();

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-900"
    >
      {ONBOARDING_FIELDS.map((field) => (
        <input key={field} type="hidden" name={field} value={formData[field]} />
      ))}
      {formData.diseases.map((disease) => (
        <input key={disease} type="hidden" name="diseases" value={disease} />
      ))}

      <OnboardingProgress percent={progressPercent} />

      <div className="flex min-h-[360px] flex-col gap-900">
        <OnboardingHeader
          title={ONBOARDING_STEP_TITLES.get(formData.petName.trim())[step] ?? ""}
          onBack={() => step > 0 && goToStep((step - 1) as OnboardingStep)}
          canGoBack={step > 0}
        />

        <div className={ONBOARDING_CAROUSEL_VIEWPORT_CLASS} ref={emblaRef}>
          <div className="flex">
            {STEP_COMPONENTS.map((StepComponent, index) => {
              const stepIndex = index as OnboardingStep;

              return (
                <div key={`step-${index}`} className={ONBOARDING_STEP_CONTAINER_CLASS}>
                  {index < 2 ? (
                    <StepComponent
                      data={formData}
                      onChange={handleChange}
                      errors={validationErrors}
                      showErrors={showErrorsByStep[stepIndex]}
                    />
                  ) : (
                    <StepComponent data={formData} onChange={handleChange} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant={isLastStep ? "primary" : "secondary"}
        size="xxlarge"
        fullWidth
        onClick={handlePrimaryButtonClick}
        isDisabled={isLastStep && !validateForm(formData)}
      >
        {primaryLabel}
      </Button>
    </form>
  );
}
