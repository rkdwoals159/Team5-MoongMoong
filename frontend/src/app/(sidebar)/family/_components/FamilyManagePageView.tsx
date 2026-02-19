import { cn } from "@/utils/style";
import DogInfoSection from "./DogInfoSection";
import GroupInviteUrlCard from "./GroupInviteUrlCard";
import FamilyMemberList from "./FamilyMemberList";
import InviteUrlForm from "./InviteUrlForm";
import { getGroupCrew } from "@/app/(sidebar)/family/_api";

export default async function FamilyManagePageView() {
  const groupCrew = await getGroupCrew();

  return (
    <div className="flex flex-col gap-600">
      <div className="grid grid-cols-1 gap-600 lg:grid-cols-2">
        <section className={sectionCardClasses}>
          <SectionHeader title="강아지 정보" />
          <div className="flex flex-col gap-600">
            <DogInfoSection size="large" />
            <GroupInviteUrlCard inviteUrl={groupCrew.inviteUrl} />
          </div>
        </section>

        <section className={cn(sectionCardClasses, "justify-between")}>
          <FamilyMemberList
            members={[groupCrew.memberName, ...(groupCrew.crews ?? [])].filter(
              (m): m is string => !!m,
            )}
          />

          <div className="border-t border-gray-200 pt-600">
            <p className="typo-caption-s-bold mb-350 text-gray-500">다른 가족 참여하기</p>
            <InviteUrlForm isAlone={!groupCrew.crews?.length} />
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <h2 className="typo-body-m-bold text-gray-500">{title}</h2>;
}

const sectionCardClasses =
  "flex flex-col gap-500 rounded-500 border border-gray-200 bg-white-100 p-600";
