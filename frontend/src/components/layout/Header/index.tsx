import { cn } from "@/utils/style";
import { client } from "@/lib/api";
import { getPetInfo } from "@/api/petInfoApi";
import { components } from "@/types/schema";
import type { HeaderProps } from "./header.type";
import Profile from "@/components/layout/Profile";
import Notification from "@/components/layout/Notification";
type GetMemberInfoResponse = components["schemas"]["MemberInfoResponse"];

export async function getMemberInfo(): Promise<GetMemberInfoResponse | undefined> {
  const { data } = await client.GET("/api/member");
  return data;
}

export default async function Header({ className, ...rest }: HeaderProps) {
  const [memberInfo, petInfo] = await Promise.all([getMemberInfo(), getPetInfo()]);

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
        memberImage={process.env.NEXT_PUBLIC_DEFAULT_IMAGE!}
      />
    </header>
  );
}
