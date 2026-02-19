import CalendarDayCell from "./CalendarDayCell";
import { getDayLabels } from "@/utils/date";
import {
  CALENDAR_GRID_MIN_WIDTH,
  CALENDAR_LABEL_HEIGHT_PX,
} from "@/app/(sidebar)/calendar/_constants/calendarGrid";
import type { CalendarGridProps } from "@/app/(sidebar)/calendar/_types";
import { getCalendarGridRowHeight } from "@/app/(sidebar)/calendar/_utils";

const GRID_MIN_WIDTH_CLASS = `min-w-[${CALENDAR_GRID_MIN_WIDTH}]`;
const LABEL_GRID_HEIGHT_CLASS = `h-[${CALENDAR_LABEL_HEIGHT_PX}px]`;
const LABEL_CELL_CLASS = `flex ${LABEL_GRID_HEIGHT_CLASS} items-center border border-gray-50 bg-gray-50 px-350 py-200`;

export default function CalendarGrid({ days, weeks, selectedDate }: CalendarGridProps) {
  const labels = getDayLabels();
  const { isCompact, rowHeight } = getCalendarGridRowHeight(weeks);

  return (
    <section className="w-full">
      <div className={`grid ${GRID_MIN_WIDTH_CLASS} grid-cols-7`}>
        {labels.map((label, index) => (
          <div
            key={label}
            className={`${LABEL_CELL_CLASS} ${index === 0 ? "rounded-tl-600" : ""} ${index === labels.length - 1 ? "rounded-tr-600" : ""}`}
          >
            <span className="typo-body-l-bold text-text-base">{label}</span>
          </div>
        ))}
      </div>
      <div
        className={`grid ${GRID_MIN_WIDTH_CLASS} grid-cols-7`}
        style={{ gridTemplateRows: `repeat(${weeks}, ${rowHeight})` }}
      >
        {days.map((day, index) => (
          <CalendarDayCell
            key={day.date}
            day={day}
            isSelected={day.date === selectedDate}
            hasSelectedDate={Boolean(selectedDate)}
            isBottomLeft={index === days.length - 7}
            isBottomRight={index === days.length - 1}
            isCompact={isCompact}
          />
        ))}
      </div>
    </section>
  );
}
