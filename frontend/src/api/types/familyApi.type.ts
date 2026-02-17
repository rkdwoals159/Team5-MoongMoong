import { components } from "@/types/schema";

export type GroupParticipateResponse = components["schemas"]["PetGroupParticipateResponse"];

export type ParticipateResult =
  | { data: GroupParticipateResponse; error: null }
  | { data: null; error: string };
