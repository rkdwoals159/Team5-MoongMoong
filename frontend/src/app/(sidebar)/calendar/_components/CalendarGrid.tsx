import CalendarDayCell from "./CalendarDayCell";
import { getDayLabels } from "@/utils/date";
import type { CalendarGridProps } from "@/app/(sidebar)/calendar/_types";

export default function CalendarGrid({ days, weeks, selectedDate, monthParam }: CalendarGridProps) {
  const labels = getDayLabels();

  return (
    <section className="w-full">
      <div className="grid min-w-[1141px] grid-cols-7">
        {labels.map((label, index) => (
          <div
            key={label}
            className={`${"flex h-[48px] items-center border border-(--color-gray-50) bg-(--color-gray-50) px-350 py-300"} ${
              index === 0 ? "rounded-tl-600" : ""
            } ${index === labels.length - 1 ? "rounded-tr-600" : ""}`}
          >
            <span className="typo-body-m-bold text-(--color-text-base)">{label}</span>
          </div>
        ))}
      </div>
      <div
        className="grid min-w-[1141px] grid-cols-7"
        style={{ gridTemplateRows: `repeat(${weeks}, 120px)` }}
      >
        {days.map((day, index) => (
          <CalendarDayCell
            key={day.date}
            day={day}
            isSelected={day.date === selectedDate}
            isBottomLeft={index === days.length - 7}
            isBottomRight={index === days.length - 1}
            monthParam={monthParam}
          />
        ))}
      </div>
    </section>
  );
}
