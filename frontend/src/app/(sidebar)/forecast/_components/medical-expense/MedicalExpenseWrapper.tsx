import MedicalExpenseHeader from "./MedicalExpenseHeader";

export default function MedicalExpenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="flex flex-col gap-600 rounded-500 border border-gray-100 bg-white-100 p-600 overflow-hidden w-full mb-[50px]">
        <MedicalExpenseHeader />
        {children}
      </div>
    </section>
  );
}
