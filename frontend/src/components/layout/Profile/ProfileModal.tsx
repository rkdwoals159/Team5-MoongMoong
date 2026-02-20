import NextImage from "next/image";
import Button from "@/components/common/Button/Button";
import type { ProfileModalProps } from "./profileModal.type";
export default function ProfileModal({
  profileImage,
  dogName,
  nickname,
  onLogout,
}: ProfileModalProps) {
  return (
    <>
      <div className="flex flex-col items-center pt-700 pb-600 px-700">
        <div className="w-[100px] h-[100px] rounded-300 overflow-hidden">
          <NextImage
            src={profileImage}
            alt={`${dogName}의 프로필 이미지`}
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="mt-400 typo-title-m-bold text-gray-800">{dogName}</span>
      </div>

      <div className="border-t border-gray-100 mx-700" />

      <div className="flex justify-between items-center py-600 px-700">
        <span className="typo-body-m-medium text-gray-400">닉네임</span>
        <span className="typo-body-m-bold text-gray-800">{nickname}</span>
      </div>

      <div className="px-700 pb-700">
        <Button variant="secondary" fullWidth onClick={onLogout}>
          로그아웃
        </Button>
      </div>
    </>
  );
}
