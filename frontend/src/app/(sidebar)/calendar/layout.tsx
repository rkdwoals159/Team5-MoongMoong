export default function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <article className="px-8">{children}</article>;
}
