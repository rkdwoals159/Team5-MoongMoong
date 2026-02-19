const FamilyManageSkeleton = () => {
  return (
    <div className="flex flex-col gap-600" aria-hidden>
      <div className="grid grid-cols-1 gap-600 lg:grid-cols-2">
        <div className="flex flex-col gap-500 rounded-500 border border-gray-200 bg-white-100 p-600">
          <div className="h-5 w-20 rounded-250 bg-gray-200 animate-pulse" />
          <div className="flex flex-col gap-600">
            <div className="h-24 w-full rounded-500 bg-gray-200 animate-pulse" />
            <div className="h-14 w-full rounded-500 bg-gray-200 animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-500 rounded-500 border border-gray-200 bg-white-100 p-600">
          <div className="flex flex-col gap-400">
            <div className="h-5 w-24 rounded-250 bg-gray-200 animate-pulse" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-full rounded-250 bg-gray-200 animate-pulse" />
            ))}
          </div>
          <div className="border-t border-gray-200 pt-600">
            <div className="h-5 w-28 rounded-250 bg-gray-200 animate-pulse mb-350" />
            <div className="h-10 w-full rounded-500 bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyManageSkeleton;
