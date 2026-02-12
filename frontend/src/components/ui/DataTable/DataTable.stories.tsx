import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import DataTable from "./DataTable";
import type { DataTableColumn, DataTableProps } from "./dataTable.type";
import Chip from "@/components/common/Chip/Chip";

/**
 * DataTableColumn의 Type은 사용처 컴포넌트에서 설정해야함.
 * 공용 컴포넌트로 제작하고 있기에 범용성을 높이기 위한 방법..
 */
type testDataType = {
  expenseId: number;
  spentAt: string;
  usage: string;
  cost: number;
  mainCategory: string;
  subCategory?: string;
  memo: string;
  modifiedAt?: string;
};

/**
 * columns 설정 예시
 */
const cols: DataTableColumn<testDataType>[] = [
  { label: "일자", accessor: "spentAt" },
  { label: "사용내역", accessor: "usage" },
  { label: "금액", accessor: "cost" },
  { label: "대분류", accessor: "mainCategory" },
  { label: "메모", accessor: "memo" },
];

/**
 * data 설정 예시
 */
const datas: testDataType[] = [
  {
    expenseId: 0,
    spentAt: "2026-01-27",
    usage: "예방접종",
    cost: 10,
    mainCategory: "의료비",
    memo: "흑흑",
  },
];

/**
 * DataTable이 제네릭 컴포넌트이기 때문에 스토리 메타에서 T가 unknown으로 고정됨.
 * 그래서 testDataType을 고정한 래퍼 컴포넌트를 만들어서 meta.component에 넘기는 방식.
 */
const TypeDataTable = (props: DataTableProps<testDataType>) => (
  <DataTable<testDataType> {...props} />
);

/**
 * ChipColumn 설정 예시 (이 story를 참고하여 컬럼 설정 방법 확인)
 * - mainCategory 컬럼에만 Chip 컴포넌트를 적용한 예시
 */
const ChipColumnWrapper = () => {
  const chipColumns: DataTableColumn<testDataType>[] = cols.map((col) =>
    col.accessor === "mainCategory"
      ? {
          ...col,
          render: (value) => <Chip label={String(value)} level="major" color="blue" />,
        }
      : col,
  );
  return <TypeDataTable columns={chipColumns} data={datas} rowKey={(row) => row.expenseId} />;
};

/**
 * EditableColumn 설정 예시 (이 story를 참고하여 컬럼 설정 방법 확인)
 * - cost 컬럼에만 숫자 입력 가능하도록 설정한 예시
 */
const EditableWrapper = () => {
  const [rows, setRows] = useState<testDataType[]>(datas);
  const updateCell = (rowIndex: number, accessor: keyof testDataType, value: string) => {
    setRows((prev) =>
      prev.map((item, index) => (index === rowIndex ? { ...item, [accessor]: value } : item)),
    );
  };

  const editableColumns: DataTableColumn<testDataType>[] = cols.map((col) => ({
    ...col,
    editor: (value, _row, rowIndex) => (
      <input
        className="w-full bg-transparent outline-none"
        value={value ?? ""}
        onChange={(event) => {
          updateCell(rowIndex, col.accessor, event.target.value);
        }}
      />
    ),
  }));

  return (
    <TypeDataTable
      columns={editableColumns}
      data={rows}
      mode="edit"
      rowKey={(row) => row.expenseId}
    />
  );
};

const meta = {
  title: "UI/DataTable",
  component: TypeDataTable,
  args: {
    columns: cols,
    data: datas,
    rowKey: (row) => row.expenseId,
  },
} satisfies Meta<typeof TypeDataTable>;

export default meta;

type Story = StoryObj<typeof TypeDataTable>;

export const Default: Story = {};
export const Editable: Story = {
  render: () => <EditableWrapper />,
};
export const ChipColumn: Story = {
  render: () => <ChipColumnWrapper />,
};
