export type CalendarErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
