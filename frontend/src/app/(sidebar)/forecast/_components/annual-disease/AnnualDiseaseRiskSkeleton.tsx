const AnnualDiseaseRiskSkeleton = () => {
  return (
    <div className="flex flex-col gap-500 animate-pulse mt-500">
      {/* 차트 영역 스켈레톤 */}
      <div className="h-[280px] bg-gray-100 rounded-300 flex items-center justify-center">
        <p className="typo-body-l-medium text-text-sub">차트 로딩중입니다...</p>
      </div>

      {/* 질병 선택 영역 스켈레톤 */}
      <div className="flex flex-wrap gap-300">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-9 w-20 bg-gray-100 rounded-250" />
        ))}
      </div>
    </div>
  );
};

export default AnnualDiseaseRiskSkeleton;
