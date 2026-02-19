"use client";

import { DISEASE_CODE_SHORT_NAMES } from "@/app/(sidebar)/forecast/_constants";
import Link from "next/link";
import { cn } from "@/utils/style";
import type { MedicalExpenseTabsProps } from "@/app/(sidebar)/forecast/_types/medicalExpense";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

export default function MedicalExpenseTabs({
  diseaseList,
  selectedDisease,
}: MedicalExpenseTabsProps) {
  const { scrollRef, endRef, isAtStart, isAtEnd, handleScroll } =
    useHorizontalScroll("medicalExpenseTabs");

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto no-scrollbar"
        role="tablist"
        aria-label="질병 선택"
      >
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
        <div ref={endRef} className="w-1 shrink-0" />
      </div>

      <div
        className={cn(
          "pointer-events-none absolute left-0 top-0 h-full w-[100px] bg-linear-to-r from-white-100/90 to-transparent transition-opacity duration-100",
          isAtStart ? "opacity-0" : "opacity-100",
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "pointer-events-none absolute right-0 top-0 h-full w-[100px] bg-linear-to-l from-white-100/90 to-transparent transition-opacity duration-100",
          isAtEnd ? "opacity-0" : "opacity-100",
        )}
        aria-hidden="true"
      />
    </div>
  );
}

function RankingTag({ rank }: { rank: number }) {
  return <div className={rankingTagClasses}>{rank}위</div>;
}

const tabBaseClasses =
  "shrink-0 w-[129px] px-500 py-300 flex gap-300 items-center justify-center transition-colors whitespace-nowrap cursor-pointer";
const tabSelectedClasses = "typo-title-s-bold text-gray-900 border-b-2 border-yellow-400";
const tabUnselectedClasses =
  "hover:text-gray-800 text-gray-600 typo-title-s-medium border-b border-gray-100";
const rankingTagClasses =
  "flex items-center justify-center bg-gray-100 text-gray-800 typo-caption-s-bold rounded-250 px-300 py-200 w-[30px] h-[24px]";
