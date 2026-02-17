import { cn } from "@/utils/style";
import type { FamilyManagePageViewProps } from "@/app/(sidebar)/family/_types";
import DogInfoSection from "./DogInfoSection";
import ParentingCodeCard from "./ParentingCodeCard";
import FamilyMemberList from "./FamilyMemberList";
import InviteCodeForm from "./InviteCodeForm";

export default function FamilyManagePageView({ familyInfo }: FamilyManagePageViewProps) {
  const { dog, code, members, maxMembers } = familyInfo;

  return (
    <div className="flex flex-col gap-600">
      {/* 2-column grid */}
      <div className="grid grid-cols-1 gap-600 lg:grid-cols-2">
        {/* Left: 강아지 정보 + 양육 코드 */}
        <section className={sectionCardClasses}>
          <SectionHeader title="강아지 정보" />
          <div className="flex flex-col gap-600">
            <DogInfoSection dog={dog} size="large" />
            <ParentingCodeCard code={code} />
          </div>
        </section>

        {/* Right: 가족 구성원 + 초대 */}
        <section className={cn(sectionCardClasses, "justify-between")}>
          <FamilyMemberList members={members} maxMembers={maxMembers} />

          <div className="border-t border-gray-200 pt-600">
            <p className="typo-caption-s-bold mb-350 text-gray-500">다른 가족 참여하기</p>
            <InviteCodeForm isAlone={members.length === 1} />
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
