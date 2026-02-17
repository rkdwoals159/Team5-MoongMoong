import ExpandIcon from "@/assets/icons/family/ic_expand.svg";
import type { FamilyManageModalViewProps } from "@/app/(sidebar)/family/_types";
import DogInfoSection from "./DogInfoSection";
import ParentingCodeCard from "./ParentingCodeCard";
import FamilyMemberList from "./FamilyMemberList";
import InviteCodeForm from "./InviteCodeForm";

export default function FamilyManageModalView({ familyInfo }: FamilyManageModalViewProps) {
  const { dog, code, members, maxMembers } = familyInfo;

  return (
    <div className={cardClasses}>
      <div className={contentWrapperClasses}>
        <div className="flex h-[545px] flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-850">
              <h1 className="typo-title-l-bold text-base">가족 관리</h1>
              <a
                href="/family"
                className={expandButtonClasses}
                aria-label="전체 화면으로 보기"
                title="전체 화면으로 보기"
              >
                <ExpandIcon className="size-5" aria-hidden="true" />
              </a>
            </div>

            <div className="flex flex-col gap-350 px-850">
              <p className="typo-caption-s-bold text-gray-500">강아지 정보</p>
              <DogInfoSection dog={dog} />
              <ParentingCodeCard code={code} />
            </div>

            <div className="px-850">
              <FamilyMemberList members={members} maxMembers={maxMembers} />
            </div>
          </div>

          <div className="px-850">
            <InviteCodeForm isAlone={members.length === 1} />
          </div>
        </div>
      </div>
    </div>
  );
}

const cardClasses =
  "relative overflow-hidden rounded-600 bg-white-100 shadow-[0px_4px_40px_0px_rgba(26,31,39,0.25)]";

const contentWrapperClasses = "mx-auto w-[450px] py-850";

const expandButtonClasses =
  "cursor-pointer rounded-300 p-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600";
