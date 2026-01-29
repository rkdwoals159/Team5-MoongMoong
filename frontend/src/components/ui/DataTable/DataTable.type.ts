import type { ReactNode } from "react";

/**
 * render: 값 렌더링을 커스터마이즈할 때 사용 (없으면 기본 텍스트 렌더링)
 * editor: 편집 모드에서만 사용 (mode="edit" && editor 존재 시 우선 적용)
 */
export type DataTableColumn<T> = {
  label: string;
  accessor: keyof T;
  width?: string;
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
};
