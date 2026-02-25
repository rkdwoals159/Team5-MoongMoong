export default function AnalysisTableWrapper({
  header,
  children,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-400">
      <div className="flex flex-col gap-200">{header}</div>
      <div className="relative h-[336px] flex items-center justify-center">{children}</div>
    </section>
  );
}
