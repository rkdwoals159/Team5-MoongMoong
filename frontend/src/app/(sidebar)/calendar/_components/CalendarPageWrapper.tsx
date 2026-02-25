import PageHeader from "@/components/layout/Header/PageHeader";

export default function CalendarPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader title="달력" />
      <div className="flex flex-col gap-500">{children}</div>
    </>
  );
}
