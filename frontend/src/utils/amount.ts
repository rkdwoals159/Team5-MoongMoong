export function formatAmount(value: number) {
  return `${new Intl.NumberFormat("ko-KR").format(value)}원`;
}

export function formatAmountPlain(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function parseAmountPlain(str: string): number {
  const cleaned = str.replace(/[^0-9]/g, "");
  return cleaned === "" ? 0 : Number(cleaned);
}
