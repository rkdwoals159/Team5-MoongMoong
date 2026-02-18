import { DISEASE_CODE_SHORT_NAMES } from "@/app/(sidebar)/forecast/_constants";
import { DOG_BREEDS } from "@/constants";

export const BREEDS: Record<string, string> = Object.fromEntries(
  DOG_BREEDS.map((breed) => [breed.code, breed.koName]),
) as Record<string, string>;

export { ADMINISTRATIVE_DISTRICTS } from "@/constants";

export const DISEASES = Object.keys(DISEASE_CODE_SHORT_NAMES);
