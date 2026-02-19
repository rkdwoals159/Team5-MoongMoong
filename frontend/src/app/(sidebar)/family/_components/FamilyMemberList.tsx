import type { FamilyMemberListProps } from "@/app/(sidebar)/family/_types";
import { MAX_CREW_MEMBERS } from "@/app/(sidebar)/family/_constants";

export default function FamilyMemberList({ members }: FamilyMemberListProps) {
  return (
    <div className="flex flex-col gap-350">
      <div className="flex gap-1 typo-caption-s-bold text-gray-500">
        <span>가족 정보</span>
        <span>
          ({members?.length}/{MAX_CREW_MEMBERS})
        </span>
      </div>

      <div className="flex flex-col gap-300">
        {members?.map((member, idx) => (
          <div key={`${member}-${idx}`} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="typo-body-m-bold text-base">{member}</span>
              {idx === 0 && (
                <span className={meBadgeClasses}>
                  <span className="typo-caption-s-bold text-yellow-500">나</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meBadgeClasses = "flex size-[22px] items-center justify-center rounded-full bg-yellow-100";
