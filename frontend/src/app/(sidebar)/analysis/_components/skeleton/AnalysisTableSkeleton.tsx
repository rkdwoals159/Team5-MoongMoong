export default function AnalysisTableSkeleton() {
  return (
    <section className="flex flex-col gap-400">
      <div className="flex flex-col gap-200">
        <div className="h-[18px] w-[220px] rounded-200 bg-gray-100" />
        <div className="h-[28px] w-[140px] rounded-200 bg-gray-200" />
      </div>
      <div className="h-[336px] rounded-600 border border-gray-50 bg-white-100">
        <div className="h-[48px] border-b border-gray-50 bg-gray-50" />
        <div className="h-[288px] bg-gray-50" />
      </div>
    </section>
  );
}
