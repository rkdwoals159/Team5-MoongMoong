import FamilyModal from "@/app/(sidebar)/family/_components/FamilyModal";
import FamilyManageModalView from "@/app/(sidebar)/family/_components/FamilyManageModalView";
import type { FamilyInfo } from "@/app/(sidebar)/family/_types";

// TODO: 실제 API 연동 시 서버에서 데이터 fetch
const mockFamilyInfo: FamilyInfo = {
  dog: {
    imageUrl: "/images/img_dog_default.svg",
    name: "코코",
    breed: "미니어처푸들",
    age: 10,
    sex: "female",
  },
  code: "AMCPO",
  maxMembers: 6,
  members: [
    { id: 1, nickname: "코코맘", joinedAt: "2025.10.03", isMe: true },
    { id: 2, nickname: "코코할머니", joinedAt: "2025.12.01", isMe: false },
    { id: 3, nickname: "코코언니", joinedAt: "2025.11.03", isMe: false },
    { id: 4, nickname: "코코봉", joinedAt: "2025.10.05", isMe: false },
    { id: 5, nickname: "코코쿤", joinedAt: "2025.09.03", isMe: false },
    { id: 6, nickname: "코코아빠", joinedAt: "2025.08.05", isMe: false },
  ],
};

export default function InterceptedFamilyPage() {
  return (
    <FamilyModal>
      <FamilyManageModalView familyInfo={mockFamilyInfo} />
    </FamilyModal>
  );
}
