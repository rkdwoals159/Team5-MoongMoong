export const AMOUNT_PRESETS = [1000, 5000, 10000] as const;

export const SAVING_AMOUNT_RESTRAINTS = {
  MIN: 100,
  MAX: 1_000_000,
  MIN_WARNING: "최소 100원 이상 입력해주세요",
  MAX_WARNING: "최대 1,000,000원까지 입력 가능합니다",
} as const;

export const NEW_SAVING_AMOUNT_RESTRAINTS = {
  MIN: 100,
  MIN_WARNING: "최소 100원 이상 입력해주세요",
  MAX: 1_000_000,
  MAX_WARNING: "최대 1,000,000원까지 입력 가능합니다",
} as const;

export const TARGET_AMOUNT_RESTRAINTS = {
  MAX: 10_000_000,
  MAX_WARNING: "목표 금액은 10,000,000원을 초과할 수 없습니다.",
} as const;
