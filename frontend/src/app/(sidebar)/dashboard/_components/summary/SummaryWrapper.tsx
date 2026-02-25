export default function SummaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full">
      <div
        className="grid w-full items-stretch gap-500"
        style={{ gridTemplateColumns: "1fr 1fr 210px" }}
      >
        {children}
      </div>
    </section>
  );
}
