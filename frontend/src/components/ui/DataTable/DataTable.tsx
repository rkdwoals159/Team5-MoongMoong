import { DataTableProps } from "./DataTable.type";
import cn from "@/utils/style";

const DataTable = <T,>({
  className,
  columns,
  data,
  mode = "read",
  rowKey,
  ...rest
}: DataTableProps<T>) => {
  return (
    <div
      className={cn("w-full border border-gray-50 rounded-600 overflow-hidden", className ?? "")}
    >
      <table {...rest} className="w-full border-separate border-spacing-0 text-left">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="h-[48px] px-500 py-200 bg-gray-50 text-text-base typo-body-m-bold"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowKey ? rowKey(row, rowIndex) : rowIndex}
              className="border-b border-gray-50 last:border-b-0"
            >
              {columns.map((col) => (
                <td
                  key={`${rowIndex}-${String(col.accessor)}`}
                  className="h-[48px] px-500 py-200 bg-white-100 text-text-base typo-body-m-regular"
                >
                  {mode === "edit" && col.editor ? (
                    col.editor(row[col.accessor], row, rowIndex)
                  ) : col.render ? (
                    col.render(row[col.accessor], row, rowIndex)
                  ) : (
                    <span>{row[col.accessor] == null ? "-" : String(row[col.accessor])}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
