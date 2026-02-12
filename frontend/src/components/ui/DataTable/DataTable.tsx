import type { DataTableProps, DataTableColumn, DataTableShellCol } from "./dataTable.type";
import DataTableShell from "./DataTableShell";
import { TH_BASE_CLASS } from "./dataTableConstants";

/**
 * 읽기 전용 DataTable (Server Component)
 * 정렬·셀 클릭·키보드 네비게이션은 DataTableInteractive 사용
 */
const DataTable = <T,>({
  className,
  columns,
  data,
  mode = "read",
  rowKey,
  ...rest
}: DataTableProps<T>) => {
  const renderCell = (col: DataTableColumn<T>, row: T, rowIndex: number) => {
    return col.render ? (
      col.render(row[col.accessor], row, rowIndex)
    ) : mode === "edit" && col.editor ? (
      col.editor(row[col.accessor], row, rowIndex)
    ) : (
      <span className="block px-500 py-200">
        {row[col.accessor] == null ? "-" : String(row[col.accessor])}
      </span>
    );
  };

  const colgroupColumns: DataTableShellCol[] = columns.map((c) => ({
    accessor: String(c.accessor),
    width: c.width,
  }));

  return (
    <DataTableShell className={className} columns={colgroupColumns} {...rest}>
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>
          {columns.map((col) => (
            <th key={String(col.accessor)} className={TH_BASE_CLASS} style={{ width: col.width }}>
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
                className="h-[48px] bg-white-100 text-text-base typo-body-m-regular border-b border-gray-50 hover:bg-yellow-50"
                style={{ width: col.width }}
              >
                <div className="flex h-full min-h-[48px] items-center">
                  {renderCell(col, row, rowIndex)}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </DataTableShell>
  );
};

export default DataTable;
