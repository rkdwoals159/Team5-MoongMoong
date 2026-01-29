import EditableDataTable from "./_components/EditableDataTable";
import { ExpenseData } from "./_types/dashboard.type";

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

export default function DashboardHomePage() {
  return (
    <div className="p-8">
      <div className="rounded-2xl border border-[var(--color-border-light)] bg-white p-6">
        <h1 className="typo-headline-s-bold text-[var(--color-text-base)]">대시보드 영역</h1>
        <p className="typo-body-m-medium mt-2 text-[var(--color-gray-500)]">
          콘텐츠는 추후 추가 예정입니다.
        </p>
      </div>
      <EditableDataTable initialData={initialData} className="h-[480px]" />
    </div>
  );
}
