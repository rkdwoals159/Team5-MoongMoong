import DashboardTableSection from "./_components/DashboardTableSection";
import ExpenseTableToolbar from "./_components/ExpenseTableToolbar";
import ProgressSummarySection from "./_components/ProgressSummarySection";
import { ExpenseData, ProgressData, ImageData } from "./_types";

// TODO: API 호출 (SERVER)
const initialData: ExpenseData[] = [
  {
    expenseId: 0,
    spentAt: "2026-01-00",
    usage: "예방접종",
    cost: 100000,
    mainCategory: "의료비",
    subCategory: "약/처방",
    memo: "흑흑",
  },
  {
    expenseId: 1,
    spentAt: "2026-01-01",
    usage: "치과 치료",
    cost: 100,
    mainCategory: "의료비",
    subCategory: "검사비",
    memo: "으악",
  },
  {
    expenseId: 2,
    spentAt: "2026-01-02",
    usage: "미용실 미용",
    cost: 100,
    mainCategory: "미용",
    memo: "으악",
  },
  {
    expenseId: 3,
    spentAt: "2026-01-03",
    usage: "의류 구매",
    cost: 100,
    mainCategory: "의류",
    memo: "으악",
  },
  {
    expenseId: 4,
    spentAt: "2026-01-04",
    usage: "영양제 구매",
    cost: 100,
    mainCategory: "영양제",
    memo: "으악",
  },
  {
    expenseId: 5,
    spentAt: "2026-01-05",
    usage: "사료 구매",
    cost: 100,
    mainCategory: "사료",
    memo: "으악",
  },
  {
    expenseId: 6,
    spentAt: "2026-01-06",
    usage: "간식 구매",
    cost: 100,
    mainCategory: "간식",
    memo: "으악",
  },
  {
    expenseId: 7,
    spentAt: "2026-01-07",
    usage: "기타 구매",
    cost: 100,
    mainCategory: "기타",
    memo: "으악",
  },
];

// TODO: API 호출 (SERVER)
// - 응답에 petName 포함(전역 상태에서 가져오면 "use client" 필요)
const progressData: ProgressData = {
  totalExpense: {
    forecast: 26,
    isMinus: true,
  },
  medicalExpense: {
    forecast: 14,
    isMinus: false,
  },
  petName: "코코",
};

// TODO: API 호출 (SERVER)
const imageData: ImageData = {
  src: "/images/img_dog_sample.png",
};

export default function DashboardHomePage() {
  return (
    <>
      <div className="flex-1 min-h-0 flex flex-col gap-850 px-8">
        <ProgressSummarySection data={progressData} image={imageData} />
        <DashboardTableSection
          initialData={initialData}
          tableClassName="min-h-0 flex-1 overflow-auto"
        />
      </div>
      {/* TODO: totalExpense, selectedCount, hasUnsavedChanges 상태 전달 방법 고민 */}
      <ExpenseTableToolbar totalExpense={1000000} selectedCount={2} hasUnsavedChanges={true} />
    </>
  );
}
