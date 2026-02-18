/** 캘린더 그리드 셀 (DatePickerPopup용) */
export type CalendarGridCell = {
  dateKey: string;
  day: number;
  isCurrentMonth: boolean;
};

/**
 * DatePickerPopup 공용 props.
 * maxDate와 maxMonthsFromToday 동시 전달 시 maxDate 우선 적용.
 */
export type DatePickerPopupProps = {
  position: { top: number; left: number };
  value: string;
  onChange: (dateKey: string) => void;
  onClose: () => void;
  minHeight?: number;
  minDate?: string;
  maxDate?: string;
  maxMonthsFromToday?: number;
  dayLabels?: readonly string[];
};
