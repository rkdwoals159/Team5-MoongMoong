"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/Header/PageHeader";
import DateRangePicker from "@/components/common/DateRangePicker/DateRangePicker";
import type { AnalysisHeaderProps } from "@/app/(sidebar)/analysis/_types/componentPropsType.type";
export default function AnalysisHeader({ startDate, endDate }: AnalysisHeaderProps) {
  const router = useRouter();

  const handleRangeChange = (nextStart: string, nextEnd: string) => {
    const params = new URLSearchParams();
    params.set("startDate", nextStart);
    params.set("endDate", nextEnd);
    params.delete("month");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-400">
      <PageHeader title="반려동물 소비분석" />
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        navigationUnit="month"
        onRangeChange={handleRangeChange}
      />
    </div>
  );
}
