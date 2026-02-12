export type NavigationUnit = "day" | "week" | "month";

export type DateRangePickerProps = {
  startDate: string;
  endDate: string;
  onRangeChange: (start: string, end: string) => void;
  minDate?: string;
  maxDate?: string;
  navigationUnit?: NavigationUnit;
  className?: string;
  dateFormat?: (dateKey: string) => string;
  ariaLabelPrev?: string;
  ariaLabelNext?: string;
};
