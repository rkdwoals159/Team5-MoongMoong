import NextImage from "next/image";
import Button from "@/components/common/Button/Button";
import { ProfileModalProps } from "./ProfileModal.type";

export default function ProfileModal({
  profileImage,
  dogName,
  nickname,
  onLogout,
}: ProfileModalProps) {
  return (
    <div
      role="dialog"
      aria-label="프로필 메뉴"
      className="absolute top-full right-0 mt-200 z-50 w-[280px] rounded-600 border border-gray-100 bg-white-100 shadow-[0px_4px_20px_0px_rgba(26,31,39,0.12)] flex flex-col"
    >
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
    </div>
  );
}
