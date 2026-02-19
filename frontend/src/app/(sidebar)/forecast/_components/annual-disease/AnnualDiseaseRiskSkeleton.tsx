export default function AnnualDiseaseRiskSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="h-[300px] w-full pt-600">
        <div className="h-full bg-gray-100 rounded-300" />
      </div>

      <div className="flex flex-col gap-300 pt-1200">
        <div className="px-300 flex justify-end">
          <div className="h-8 w-[100px] bg-gray-100 rounded-250" />
        </div>
        <div className="flex flex-wrap gap-300">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-gray-100 rounded-250" />
          ))}
        </div>

        <div className="w-full border-t border-dashed border-gray-100 my-500" />

        <div className="flex flex-wrap gap-300">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-20 bg-gray-100 rounded-250" />
          ))}
        </div>
      </div>
    </div>
  );
}
