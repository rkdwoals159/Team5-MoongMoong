import client from "@/lib/api";
import type { components } from "@schema";

export async function createPet() {
  const { data, error, response } = await client.POST("/api/pet", {
    body: {
      petName: "초코",
      breed: "DAS",
      gender: "M",
      // TODO: 백엔드 API 수정 전까지 임시 캐스팅 처리
      birthDate: "2026-02",
      city: "서울시",
      district: "종로구",
      diseases: ["OCU", "MUS"],
    } as unknown as components["schemas"]["PetCreateRequest"],
  });
  return { data, error, response };
}
