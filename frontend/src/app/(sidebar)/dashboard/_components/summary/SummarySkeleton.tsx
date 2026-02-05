const SummarySkeleton = () => {
  return (
    <section className="w-full" aria-hidden>
      <div
        className="grid w-full items-stretch gap-500"
        style={{ gridTemplateColumns: "1fr 1fr 210px" }}
      >
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex h-full min-h-0 flex-col justify-center rounded-600 border border-border-light bg-white p-600"
          >
            <div className="flex flex-col gap-500">
              <div className="h-12 w-12 shrink-0 rounded-500 bg-gray-200 animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="h-5 w-3/4 rounded-250 bg-gray-200 animate-pulse" />
                <div className="h-7 w-1/2 rounded-250 bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
        <div className="size-[210px] shrink-0 overflow-hidden rounded-600 bg-gray-200 animate-pulse" />
      </div>
    </section>
  );
};

export default SummarySkeleton;
