export default function SavingSkeleton() {
  return (
    <main className="flex gap-700 flex-1 min-h-0 min-w-0 animate-pulse">
      <section className="flex flex-col gap-850 flex-1 min-h-0">
        <div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-300">
              <div className="h-5 w-32 bg-gray-100 rounded-250" />
              <div className="h-8 w-64 bg-gray-100 rounded-250" />
            </div>
            <div className="h-10 w-28 bg-gray-100 rounded-250" />
          </div>
          <div className="mt-400 h-5 w-full rounded-full bg-gray-100" />
        </div>
        <div className="bg-yellow-200 rounded-600 flex-1 min-h-0 w-full" />
        <div className="h-12 w-full bg-gray-100 rounded-250" />
      </section>
      <section className="flex flex-col w-1/3 shrink-0 border border-gray-100 rounded-600 py-700 px-600 gap-300">
        <div className="h-7 w-48 bg-gray-100 rounded-250" />
        <div className="h-5 w-40 bg-gray-100 rounded-250" />
      </section>
    </main>
  );
}
