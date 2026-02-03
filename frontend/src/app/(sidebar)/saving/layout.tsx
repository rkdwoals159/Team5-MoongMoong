import { Metadata } from "next";

export const metadata: Metadata = {
  title: "저금통",
  description: "저금통",
};

const SavingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-850 px-850 text-neutral-900 max-w-full h-full overflow-hidden pb-1200">
      {children}
    </div>
  );
};

export default SavingLayout;
