import { client } from "@/lib/api";
import type { PostPetRequest, PostPetResult } from "@/api/types/petApi.type";

export async function postPet(): Promise<PostPetResult> {
  const body: PostPetRequest = {
    petName: "초코",
    breed: "DAS",
    gender: "M",
    // TODO: 백엔드 API 수정 전까지 임시 캐스팅 처리
    birthDate: "2026-02",
    city: "서울시",
    district: "종로구",
    diseases: ["OCU", "MUS"],
  };

  const { data, response } = await client.POST("/api/pet", { body });

  return { data, response };
}
