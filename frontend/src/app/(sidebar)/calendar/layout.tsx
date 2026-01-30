export default function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <article className="px-8">
      <div className="flex flex-col gap-850">{children}</div>
    </article>
  );
}
