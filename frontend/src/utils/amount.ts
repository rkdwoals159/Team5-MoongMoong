export const formatAmount = (value: number) => `${new Intl.NumberFormat("ko-KR").format(value)}원`;

export const formatAmountPlain = (value: number) => new Intl.NumberFormat("ko-KR").format(value);

export const parseAmountPlain = (str: string): number => {
  const cleaned = str.replace(/[^0-9]/g, "");
  return cleaned === "" ? 0 : Number(cleaned);
};
