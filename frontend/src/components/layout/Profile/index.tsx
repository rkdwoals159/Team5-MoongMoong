"use client";

import ChevronIcon from "@/components/ui/Dropdown/ChevronIcon";
import { useState, useRef } from "react";
import ClientModal from "@/components/ui/Modal/ClientModal";
import { useRouter } from "next/navigation";
import ProfileModal from "@/components/layout/Profile/ProfileModal";

type ProfileProps = {
  name: string;
  petName: string;
  memberImage: string;
};

const Profile = ({ name, petName, memberImage }: ProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    setIsOpen(false);
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <div ref={buttonRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-200 cursor-pointer text-gray-800 typo-body-l-medium"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className="hover:underline">{name} 님</span>
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
          profileImage={memberImage}
          dogName={petName}
          nickname={name}
          onLogout={handleLogout}
        />
      </ClientModal>
    </div>
  );
};

export default Profile;
