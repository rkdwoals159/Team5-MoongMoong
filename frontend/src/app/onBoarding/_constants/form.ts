import type { OnboardingFormData, OnboardingStep } from "@/app/onBoarding/_types";

export const STEP_COUNT = 3;
export const LAST_STEP = 2 as OnboardingStep;
export const DEFAULT_PET_NAME = "코코";

export const MAX_PET_NAME_LENGTH = 10;

export const ONBOARDING_CAROUSEL_VIEWPORT_CLASS =
  "relative min-h-[240px] overflow-x-clip overflow-y-visible";
export const ONBOARDING_STEP_CONTAINER_CLASS = "min-h-[240px] flex-[0_0_100%]";

export const BIRTH_DATE_PLACEHOLDER = "YYYY-MM";
export const BIRTH_DATE_MAX_LENGTH = 7;

export const CITY_PLACEHOLDER = "시/도를 선택해주세요";
export const DISTRICT_PLACEHOLDER = "시/구/군을 선택해주세요";

export const DISEASE_CHOICE_HELP_TEXT = "복수 선택 가능하며, 이후 추가하거나 수정할 수 있어요.";
export const DISEASE_SELECTION_LABEL = "걱정되는 질병";
export const DISEASE_SELECTION_LABEL_OPTIONAL = "(선택)";

export const STEP_ONE_TITLE = "우리 강아지의 정보를 입력해주세요";
export const STEP_TWO_TITLE_SUFFIX = "의 나이는 몇살이고, 어디서 사나요?";
export const STEP_THREE_TITLE_PREFIX = "우리";
export const STEP_THREE_TITLE_SUFFIX = "에게 걱정되는 질병은\n어떤 게 있으신가요?";

export const ONBOARDING_FIELD_ERROR_MESSAGES = {
  PET_NAME_REQUIRED: "강아지 이름을 입력해주세요.",
  BREED_REQUIRED: "견종을 선택해주세요.",
  GENDER_REQUIRED: "성별을 선택해주세요.",
  BIRTH_DATE_REQUIRED: "출생 년월을 입력해주세요.",
  BIRTH_DATE_INVALID: "YYYY-MM 형식으로 입력해주세요.",
  CITY_REQUIRED: "시/도를 선택해주세요.",
  DISTRICT_REQUIRED: "시/구/군을 선택해주세요.",
  FUTURE_BIRTH_DATE: "미래 날짜는 입력할 수 없습니다.",
} as const;

export const ONBOARDING_BIRTH_DATE_REGEXP = /^(19|20)\d{2}-(0[1-9]|1[0-2])$/;

export const ONBOARDING_FIELDS = [
  "petName",
  "breed",
  "gender",
  "birthDate",
  "city",
  "district",
] as const satisfies readonly (keyof OnboardingFormData)[];

export const ONBOARDING_STEP_TITLES = {
  get: (petName: string): string[] => {
    const name = petName || DEFAULT_PET_NAME;
    return [
      STEP_ONE_TITLE,
      `${name}${STEP_TWO_TITLE_SUFFIX}`,
      `${STEP_THREE_TITLE_PREFIX} ${name}${STEP_THREE_TITLE_SUFFIX}`,
    ];
  },
};

export const DEFAULT_FORM_DATA: OnboardingFormData = {
  petName: "",
  breed: "",
  gender: "",
  birthDate: "",
  city: "서울시",
  district: "",
  diseases: [],
};

export const ONBOARDING_INITIAL_STEP_ERROR_STATE: Record<OnboardingStep, boolean> = {
  0: false,
  1: false,
  2: false,
};
