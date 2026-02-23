"use client";
import { useSetRangeToUrl } from "@/app/(sidebar)/dashboard/_hooks";
import { useServerSortConfig } from "@/app/(sidebar)/dashboard/_hooks/useServerSortConfig";
import { useExpensesV2 } from "@/app/(sidebar)/dashboard/_hooks/useExpensesV2";
import { useMainCategoryFilter } from "@/app/(sidebar)/dashboard/_hooks/useMainCategoryFilter";
import EditableDataTable from "@/app/(sidebar)/dashboard/_components/dashboard-table/EditableDataTable";
import DateRangePicker from "@/components/common/DateRangePicker/DateRangePicker";

export type DashboardTableProps = {
  tableClassName?: string;
};

const DashboardTable = ({ tableClassName }: DashboardTableProps) => {
  // 정렬 상태는 DashboardTable 하나에서만 소유한다
  // -> 이 상태가 useExpenseV2(데이터 조회)와 EditableDataTable(테이블 렌더링) 양쪽에 동시에 전달된다
  const { sortConfig, handleSort, toSortParams } = useServerSortConfig();
  const { mainCategoryFilter, handleFilterChange } = useMainCategoryFilter();

  // 정렬 파라미터를 데이터 조회에 전달
  const { startDate, endDate, expenses, refetch, hasNext, isLoadingMore, loadMore, resetKey } =
    useExpensesV2({
      toSortParams,
      mainCategoryFilter,
    });
  const setRangeToUrl = useSetRangeToUrl();

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-600">
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onRangeChange={(start, end) => setRangeToUrl(start, end)}
      />
      <EditableDataTable
        initialData={expenses} // 1) 초기 데이터를 테이블에 전달
        startDate={startDate} // 2) 시작 날짜를 테이블에 전달
        endDate={endDate} // 3) 종료 날짜를 테이블에 전달
        className={tableClassName ?? ""} // 4) 테이블 컴포넌트 클래스 전달
        sortConfig={sortConfig} // 5) 정렬 상태를 테이블에 전달
        onSort={handleSort} // 6) 클릭 이벤트 위임
        onSaveSuccess={refetch} // 7) 저장 성공 시 데이터 조회 다시 시도
        resetKey={resetKey} // 8) 리셋 키를 테이블에 전달
        hasNext={hasNext} // 9) 더 불러올 데이터가 있는지 여부를 테이블에 전달
        isLoadingMore={isLoadingMore} // 10) 더 불러오는 중인지 여부를 테이블에 전달
        loadMore={loadMore} // 11) 더 불러오기 함수를 테이블에 전달
        mainCategoryFilter={mainCategoryFilter} // 12) 메인 카테고리 필터를 테이블에 전달
        onCategoryFilterChange={handleFilterChange} // 13) 메인 카테고리 필터 변경 이벤트를 테이블에 전달
      />
    </div>
  );
};

export default DashboardTable;
