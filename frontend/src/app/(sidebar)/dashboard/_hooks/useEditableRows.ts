import { useCallback, useEffect, useState } from "react";

export function useEditableRows<T>(initialData: T[]) {
  const [rows, setRows] = useState<T[]>(initialData);

  // 상위 데이터가 변경되면 내부 상태 동기화
  useEffect(() => {
    setRows(initialData);
  }, [initialData]);

  const updateCell = useCallback((rowIndex: number, accessor: keyof T, value: string) => {
    setRows((prev) =>
      prev.map((item, index) => (index === rowIndex ? { ...item, [accessor]: value } : item)),
    );
  }, []);

  // TODO: 클라이언트에서 데이터 재요청 로직
  // const refreshData = async () => {
  //   const newData = await fetch('/api/expenses').then(res => res.json());
  //   setRows(newData);
  // };

  return { rows, updateCell };
}
