import { DISEASE_CODE_SHORT_NAMES } from "@/app/(sidebar)/forecast/_constants";
import Link from "next/link";
import { cn } from "@/utils/style";
import type { MedicalExpenseTabsProps } from "@/app/(sidebar)/forecast/_types/medicalExpense";
const MedicalExpenseTabs = ({ diseaseList, selectedDisease }: MedicalExpenseTabsProps) => {
  return (
    <div className={tabScrollContainerClasses}>
      <div className={tabScrollClasses} role="tablist" aria-label="질병 선택">
        {diseaseList.map((diseaseCode, index) => {
          const label = DISEASE_CODE_SHORT_NAMES[diseaseCode];
          const isSelected = diseaseCode === selectedDisease;
          return (
            <Link
              key={diseaseCode}
              href={`?disease=${diseaseCode}&page=0`}
              scroll={false}
              className={cn(tabBaseClasses, isSelected ? tabSelectedClasses : tabUnselectedClasses)}
              role="tab"
              aria-selected={isSelected}
            >
              {index < 3 && <RankingTag rank={index + 1} />}
              {label}
            </Link>
          );
        })}
      </div>
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-[48px] bg-linear-to-l from-white-100/90 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
};

export default MedicalExpenseTabs;

const RankingTag = ({ rank }: { rank: number }) => {
  return <div className={rankingTagClasses}>{rank}위</div>;
};

const tabScrollContainerClasses = "relative w-full overflow-x-auto no-scrollbar";
const tabScrollClasses = "flex w-full max-w-[1300px] overflow-x-auto no-scrollbar";
const tabBaseClasses =
  "shrink-0 px-500 py-300 w-[150px] flex gap-300 items-center justify-center transition-colors whitespace-nowrap cursor-pointer";
const tabSelectedClasses = "typo-title-s-bold text-gray-900 border-b-2 border-yellow-400";
const tabUnselectedClasses =
  " hover:text-gray-800 text-gray-600 typo-title-s-medium border-b border-gray-100 ";
const rankingTagClasses =
  "flex items-center justify-center bg-gray-100 text-gray-800 typo-caption-s-bold rounded-250 px-300 py-200 w-[30px] h-[24px]";
