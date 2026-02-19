const FamilyManageModalSkeleton = () => {
  return (
    <div
      className="relative overflow-hidden rounded-600 bg-white-100 shadow-[0px_4px_40px_0px_rgba(26,31,39,0.25)]"
      aria-hidden
    >
      <div className="mx-auto w-[450px] py-850">
        <div className="flex h-[545px] flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="px-850">
              <div className="h-7 w-24 rounded-250 bg-gray-200 animate-pulse" />
            </div>
            <div className="flex flex-col gap-350 px-850">
              <div className="h-4 w-16 rounded-250 bg-gray-200 animate-pulse" />
              <div className="h-20 w-full rounded-500 bg-gray-200 animate-pulse" />
              <div className="h-12 w-full rounded-500 bg-gray-200 animate-pulse" />
            </div>
            <div className="flex flex-col gap-400 px-850">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-full rounded-250 bg-gray-200 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="px-850">
            <div className="h-10 w-full rounded-500 bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyManageModalSkeleton;
