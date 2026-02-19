"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

import type { OnboardingStep } from "@/app/onBoarding/_types";

const ONBOARDING_CAROUSEL_OPTIONS = {
  align: "start",
  loop: false,
  duration: 20,
  watchDrag: false,
} as const;

export function useOnboardingCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(ONBOARDING_CAROUSEL_OPTIONS);
  const [step, setStep] = useState<OnboardingStep>(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setStep(emblaApi.selectedScrollSnap() as OnboardingStep);
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const goToStep = (nextStep: OnboardingStep) => {
    if (!emblaApi) {
      setStep(nextStep);
      return;
    }

    emblaApi.scrollTo(nextStep);
    setStep(nextStep);
  };

  return {
    emblaRef,
    step,
    goToStep,
  } as const;
}
