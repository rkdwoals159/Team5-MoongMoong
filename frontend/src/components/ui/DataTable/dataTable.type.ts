import type { KeyboardEvent, ReactNode } from "react";

/**
 * render: 값 렌더링을 커스터마이즈할 때 사용 (없으면 기본 텍스트 렌더링)
 * editor: 편집 모드에서만 사용 (mode="edit" && editor 존재 시 우선 적용)
 * sortable: thead 클릭 시 정렬 가능 여부 (기본 false)
 */
export type DataTableColumn<T> = {
  label: string | ReactNode;
  accessor: keyof T;
  width?: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T, rowIndex: number) => ReactNode;
  editor?: (value: T[keyof T], row: T, rowIndex: number) => ReactNode;
};

/**
 * TODO: width, height 추가해야할지 검토 후.. 추가
 */
export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  mode?: "read" | "edit";
  rowKey?: (row: T, index: number) => string | number;
  className?: string;
  selectedCell?: { rowIndex: number; accessor: keyof T } | null;
  sortConfig?: Array<{ sortBy: keyof T; sortOrder: "asc" | "desc" }>;
  onSort?: (accessor: keyof T) => void;
  onCellClick?: (rowIndex: number, accessor: keyof T) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  bottomSlot?: ReactNode;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
};

// DataTableShell 컴포넌트에서 사용
export type DataTableShellCol = { accessor: string | number; width?: string };

// DataTableShell 컴포넌트에서 사용
export type DataTableShellProps = {
  className?: string;
  columns: DataTableShellCol[];
  children: ReactNode;
  headerSlot: ReactNode;
  bottomSlot?: ReactNode;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  tabIndex?: number;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
} & React.ComponentPropsWithoutRef<"table">;
