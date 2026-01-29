export const formatAmount = (value: number) => `${new Intl.NumberFormat("ko-KR").format(value)}원`;

export const formatAmountPlain = (value: number) => new Intl.NumberFormat("ko-KR").format(value);
