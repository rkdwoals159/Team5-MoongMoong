"use client";
import NotificationIcon from "@/assets/components/ic_notification.svg";
import ChevronIcon from "@/components/ui/Dropdown/ChevronIcon";
import { useState, useRef } from "react";
import ClientModal from "@/components/ui/Modal/ClientModal";
import ProfileModal from "./ProfileModal";

const HeaderUserActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    // TODO: 실제 로그아웃 로직 구현
    console.log("로그아웃");
  };

  return (
    <div className="flex items-center gap-600">
      <div className="flex items-center justify-center overflow-clip p-2">
        <NotificationIcon className="size-8" />
      </div>
      <div ref={buttonRef} className="relative">
        <button
          type="button"
          className="flex items-center gap-200 cursor-pointer text-gray-800 typo-body-l-medium"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <span className="hover:underline">Example 님</span>
          <div className="flex h-8 w-8 items-center justify-center overflow-clip">
            <ChevronIcon isOpen={isOpen} className="h-2 w-2" />
          </div>
        </button>
        <ClientModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          variant="dropdown"
          outsideClickRefs={[buttonRef]}
          ariaLabel="프로필 메뉴"
          contentClassName="absolute top-full right-0 mt-200 z-50 w-[280px] rounded-600 border border-gray-100 bg-white-100 shadow-[0px_4px_20px_0px_rgba(26,31,39,0.12)] flex flex-col"
        >
          <ProfileModal
            profileImage={process.env.NEXT_PUBLIC_DEFAULT_IMAGE!}
            dogName="코코"
            nickname="코코맘"
            onLogout={handleLogout}
          />
        </ClientModal>
      </div>
    </div>
  );
};

export default HeaderUserActions;
