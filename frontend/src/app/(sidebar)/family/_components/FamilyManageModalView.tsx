import ExpandIcon from "@/assets/icons/family/ic_expand.svg";
import DogInfoSection from "./DogInfoSection";
import GroupInviteUrlCard from "./GroupInviteUrlCard";
import FamilyMemberList from "./FamilyMemberList";
import { getGroupCrew } from "@/api/client/familyApi";
import InviteUrlForm from "./InviteUrlForm";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/api/lib/client";

export default async function FamilyManageModalView() {
  const groupCrew = await safeServerFetch(() => getGroupCrew());
  if (groupCrew instanceof Error) {
    return <ServerComponentErrorFallback message={groupCrew.message} />;
  }

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
              <DogInfoSection />
              <GroupInviteUrlCard inviteUrl={groupCrew.inviteUrl ?? ""} size="compact" />
            </div>

            <div className="px-850">
              <FamilyMemberList
                members={[groupCrew.memberName, ...(groupCrew.crews ?? [])].filter(
                  (m): m is string => !!m,
                )}
              />
            </div>
          </div>

          <div className="px-850">
            <InviteUrlForm isAlone={!groupCrew.crews?.length} />
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
