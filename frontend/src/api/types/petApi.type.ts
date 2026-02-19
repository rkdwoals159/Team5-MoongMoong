import type { components } from "@schema";
export type PetCreateRequest = components["schemas"]["PetCreateRequest"];

export type PetInfoResponse = NonNullable<components["schemas"]["PetReadResponse"]>;
export type PetCreateResponse = NonNullable<components["schemas"]["PetCreateResponse"]>;
