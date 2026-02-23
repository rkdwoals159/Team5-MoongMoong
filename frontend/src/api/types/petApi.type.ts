import type { components } from "@schema";
export type PetCreateRequest = components["schemas"]["PetCreateRequest"];

export type PetInfoResponse = NonNullable<components["schemas"]["PetReadResponse"]>;
export type PetCreateResponse = NonNullable<components["schemas"]["PetCreateResponse"]>;

export type PostPetRequest = PetCreateRequest;
export type PostPetResponse = PetCreateResponse;

export type PostPetResult = {
  data: PostPetResponse | undefined;
  response: Response;
};
