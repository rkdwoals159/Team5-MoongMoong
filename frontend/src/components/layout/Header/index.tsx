import { cn } from "@/utils/style";
import { getPetInfo } from "@/api/server/petApi";
import type { HeaderProps } from "./header.type";
import Profile from "@/components/layout/Profile";
import Notification from "@/components/layout/Notification";
import { getMemberInfoServer } from "@/api/server/settingsApiQueries";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/api/lib/client";

export default async function Header({ className, ...rest }: HeaderProps) {
  const memberInfo = await safeServerFetch(() => getMemberInfoServer());
  const petInfo = await safeServerFetch(() => getPetInfo());
  if (memberInfo instanceof Error || petInfo instanceof Error) {
    return (
      <header
        {...rest}
        className={cn(
          "flex w-full items-center justify-end gap-600 pr-1000 py-400 select-none border-b border-gray-100",
          className ?? "",
        )}
      >
        <ServerComponentErrorFallback message="멤버 정보 또는 반려동물 정보를 찾을 수 없어요." />
      </header>
    );
  }

  return (
    <header
      {...rest}
      className={cn(
        "flex w-full items-center justify-end gap-600 pr-1000 py-400 select-none border-b border-gray-100",
        className ?? "",
      )}
    >
      <Notification />
      <Profile
        name={memberInfo?.memberName || "견주"}
        petName={petInfo?.petName || "코코"}
        memberImage={memberInfo?.memberImageUrl || process.env.NEXT_PUBLIC_DEFAULT_IMAGE!}
      />
    </header>
  );
}
