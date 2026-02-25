import DataTable from "@/components/ui/DataTable/DataTable";
import { formatAmount } from "@/utils/amount";
import { buildExpenseColumns } from "@/app/(sidebar)/analysis/_lib/ExpenseColumns";
import type { AnalysisTableSectionProps } from "@/app/(sidebar)/analysis/_types/componentPropsType.type";
import AnalysisTableEmpty from "./AnalysisTableEmpty";
import AnalysisTableWrapper from "./AnalysisTableWrapper";

export default async function AnalysisTable({
  petInfoPromise,
  expensesPromise,
}: AnalysisTableSectionProps) {
  const petInfo = await petInfoPromise;
  const rows = await expensesPromise;
  if (petInfo instanceof Error || rows instanceof Error) {
    return (
      <AnalysisTableWrapper>
        <AnalysisTableEmpty
          message={
            petInfo instanceof Error
              ? petInfo.message
              : rows instanceof Error
                ? rows.message
                : undefined
          }
        />
      </AnalysisTableWrapper>
    );
  }

  const petName = petInfo?.petName ?? "반려동물";
  const totalCost = rows.reduce((sum, row) => sum + (row.cost ?? 0), 0);
  const totalLabel = `총 ${formatAmount(totalCost)}`;

  return (
    <AnalysisTableWrapper
      header={
        <>
          <p className="typo-body-l-bold text-gray-500">우리 가족이 {petName}에게 쓴 비용</p>
          <p className="typo-headline-l-bold text-text-base">{totalLabel}</p>
        </>
      }
    >
      <DataTable
        className="h-full border-gray-50 rounded-600"
        columns={buildExpenseColumns()}
        data={rows}
        rowKey={(row, index) => row.expenseId ?? `empty-${index}`}
      />
      {!rows.length ? (
        // 테이블 헤드 유지하면서 비어 있는 상태를 테이블 영역 위에 오버레이로 표시
        <div className="absolute inset-x-0 bottom-0 top-[48px] flex items-center justify-center border-t border-gray-50 bg-white-100">
          <AnalysisTableEmpty />
        </div>
      ) : null}
    </AnalysisTableWrapper>
  );
}
