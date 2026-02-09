export function isDifferentArray(a: unknown[] = [], b: unknown[] = []): boolean {
  return a.length !== b.length || a.some((item, index) => item !== b[index]);
}
