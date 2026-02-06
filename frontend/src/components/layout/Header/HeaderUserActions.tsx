"use client";
import NotificationIcon from "@/assets/components/ic_notification.svg";
import ChevronIcon from "@/components/ui/Dropdown/ChevronIcon";
import { useState, useRef } from "react";
import ProfileModal from "./ProfileModal";
import { useOutsideClick } from "@/hooks/useOutsideClick";

const HeaderUserActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    isActive: isOpen,
    refs: [containerRef],
    onOutside: () => setIsOpen(false),
  });

  const handleLogout = () => {
    // TODO: 실제 로그아웃 로직 구현
    console.log("로그아웃");
  };

  return (
    <div className="flex items-center gap-600">
      <div className="flex items-center justify-center overflow-clip p-2">
        <NotificationIcon className="size-8" />
      </div>
      <div ref={containerRef} className="relative">
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
        {isOpen && (
          <ProfileModal
            profileImage={process.env.NEXT_PUBLIC_DEFAULT_IMAGE!}
            dogName="코코"
            nickname="코코맘"
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
};

export default HeaderUserActions;
