import type { FamilyMemberListProps } from "@/app/(sidebar)/family/_types";

export default function FamilyMemberList({ members, maxMembers }: FamilyMemberListProps) {
  return (
    <div className="flex flex-col gap-350">
      <div className="flex gap-1 typo-caption-s-bold text-gray-500">
        <span>가족 정보</span>
        <span>
          ({members.length}/{maxMembers})
        </span>
      </div>

      <div className="flex flex-col gap-300">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="typo-body-m-bold text-base">{member.nickname}</span>
              {member.isMe && (
                <span className={meBadgeClasses}>
                  <span className="typo-caption-s-bold text-yellow-500">나</span>
                </span>
              )}
            </div>
            <span className="typo-caption-s-regular text-gray-500">{member.joinedAt} 가입</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const meBadgeClasses = "flex size-[22px] items-center justify-center rounded-full bg-yellow-100";
