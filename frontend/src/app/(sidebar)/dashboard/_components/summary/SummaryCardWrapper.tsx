import { cn } from "@/utils/style";

export default function SummaryCardWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col justify-center rounded-600 border border-border-light bg-white p-600",
        className ?? "",
      )}
    >
      <div className="flex flex-col gap-500">{children}</div>
    </div>
  );
}
