import type { ConfirmPaymentResponse, OrderIdResponse } from "@/api/types/savingApi.type";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

type TossPaymentsInstance = Awaited<ReturnType<typeof loadTossPayments>>;
export type PaymentInstance = ReturnType<TossPaymentsInstance["payment"]>;

// 토스페이먼츠 카드 결제 응답 타입
export type TossPaymentConfirmResponse = {
  paymentKey?: string;
  orderId?: string;
  amount?: {
    value: number;
    currency: string;
  } | null;
};

export type TossPaymentFailResponse = {
  code: string;
  message: string;
  orderId: string;
};

export type { OrderIdResponse, ConfirmPaymentResponse };
