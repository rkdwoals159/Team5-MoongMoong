import { DataTableProps, DataTableColumn } from "./DataTable.type";
import cn from "@/utils/style";

const DataTable = <T,>({
  className,
  columns,
  data,
  mode = "read",
  rowKey,
  selectedCell,
  ...rest
}: DataTableProps<T>) => {
  const renderCell = (col: DataTableColumn<T>, row: T, rowIndex: number) => {
    return col.render ? (
      col.render(row[col.accessor], row, rowIndex)
    ) : mode === "edit" && col.editor ? (
      col.editor(row[col.accessor], row, rowIndex)
    ) : (
      <span>{row[col.accessor] == null ? "-" : String(row[col.accessor])}</span>
    );
  };

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
              {columns.map((col) => {
                const isSelected =
                  selectedCell?.rowIndex === rowIndex && selectedCell?.accessor === col.accessor;
                return (
                  <td
                    key={`${rowIndex}-${String(col.accessor)}`}
                    className={cn(
                      "h-[48px] bg-white-100 text-text-base typo-body-m-regular transition-all hover:bg-yellow-50",
                      isSelected ? "ring-2 ring-yellow-300 ring-inset" : "",
                    )}
                  >
                    {renderCell(col, row, rowIndex)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
