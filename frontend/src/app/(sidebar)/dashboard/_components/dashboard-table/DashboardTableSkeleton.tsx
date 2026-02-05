import { EDITABLE_TABLE_MIN_ROWS } from "@/app/(sidebar)/dashboard/_constants";

const COLUMN_COUNT = 5;

const DashboardTableSkeleton = () => {
  return (
    <>
      <div className="flex flex-col flex-1 min-h-0 gap-600" aria-hidden>
        <div className="flex items-center gap-300">
          <div className="size-10 shrink-0 rounded-300 bg-gray-200 animate-pulse" />
          <div className="flex items-center gap-200">
            <div className="min-h-10 min-w-[8rem] rounded-300 bg-gray-200 animate-pulse" />
            <div className="min-h-10 min-w-[8rem] rounded-300 bg-gray-200 animate-pulse" />
          </div>
          <div className="size-10 shrink-0 rounded-300 bg-gray-200 animate-pulse" />
        </div>

        <div className="flex flex-col w-full border border-gray-50 rounded-t-600 overflow-hidden min-h-0">
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full border-separate border-spacing-0 table-fixed">
              <colgroup>
                {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
                  <col key={i} style={{ width: `${100 / COLUMN_COUNT}%` }} />
                ))}
              </colgroup>
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
                    <th
                      key={i}
                      className="h-[48px] px-500 py-200 bg-gray-50 border-b border-gray-50"
                    >
                      <div className="h-4 w-3/4 rounded-250 bg-gray-200 animate-pulse" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: EDITABLE_TABLE_MIN_ROWS }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: COLUMN_COUNT }).map((_, colIndex) => (
                      <td key={colIndex} className="h-[48px] px-500 py-200 border-b border-gray-50">
                        <div
                          className="h-4 rounded-250 bg-gray-200 animate-pulse"
                          style={{
                            width: colIndex === 2 ? "60%" : colIndex === 4 ? "90%" : "80%",
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className="-mx-8 shrink-0 bg-white-100 border-t border-gray-100 flex items-center justify-between min-h-[104px] py-400 px-600"
        style={{ boxShadow: "0 -3px 8px 0 rgba(26, 31, 39, 0.04)" }}
      >
        <div className="flex gap-300">
          <div className="h-10 w-24 rounded-300 bg-gray-200 animate-pulse" />
          <div className="h-10 w-24 rounded-300 bg-gray-200 animate-pulse" />
        </div>
        <div className="flex gap-300 items-center">
          <div className="h-5 w-20 rounded-250 bg-gray-200 animate-pulse" />
          <div className="h-10 w-[205px] rounded-300 bg-gray-200 animate-pulse" />
        </div>
      </div>
    </>
  );
};

export default DashboardTableSkeleton;
