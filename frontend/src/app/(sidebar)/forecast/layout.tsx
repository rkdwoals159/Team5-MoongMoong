import { Metadata } from "next";

export const metadata: Metadata = {
  title: "의료비 AI 예측 | Moong",
  description: "의료비 AI 예측",
};

export default function ForecastLayout({
  children,
  medicalExpense,
}: {
  children: React.ReactNode;
  medicalExpense: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-850 px-850 text-neutral-900 max-w-full">
      {children}
      {medicalExpense}
    </div>
  );
}
