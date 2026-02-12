export function cn(...classes: (string | boolean | null | undefined)[]) {
  return classes
    .filter(Boolean)
    .map((c) => String(c).trim())
    .filter(Boolean)
    .join(" ");
}
