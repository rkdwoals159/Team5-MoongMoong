"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { confirmPayment, failPayment, requestOrderId } from "@/app/(sidebar)/saving/_api";
import {
  PaymentInstance,
  TossPaymentConfirmResponse,
  TossPaymentFailResponse,
  isFailResponse,
  isConfirmResponse,
} from "@/app/(sidebar)/saving/_types";

export default function useTossPayments(customerKey: string) {
  const [payment, setPayment] = useState<PaymentInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const initRef = useRef<boolean>(false);

  // 초기 SDK 로드
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!)
      .then((tossPayments) => {
        const paymentInstance = tossPayments.payment({ customerKey });
        setPayment(paymentInstance);
        setIsReady(true);
      })
      .catch((e) => {
        console.error(e);
        setError(new Error("결제가 불가능한 상태입니다."));
      });
    // customerKey 는 로그아웃 하지 않는 이상 변경되지 않으므로, 초기화 시점에만 로드하면 된다.
  }, []);

  // 결제 플로우
  const requestPayment = useCallback(
    async (requestAmount: number) => {
      // 이미 진행 중이면 중복 요청 방지
      if (isLoading) return null;
      if (!payment) throw new Error("결제 모듈이 준비되지 않았습니다.");
      setError(null);
      setIsLoading(true);

      try {
        const { orderId, amount } = await requestOrderId(requestAmount);

        if (orderId == null) {
          throw new Error("주문 ID가 유효하지 않습니다.");
        }
        if (amount == null) {
          throw new Error("결제 금액이 유효하지 않습니다.");
        }

        // Toss Payments SDK 결제 요청
        const requestPaymentResponse = (await payment.requestPayment({
          method: "CARD",
          amount: {
            value: amount,
            currency: "KRW",
          },
          orderId: orderId,
          orderName: "저금통 저축 결제",
          card: {
            useEscrow: false,
            flowMode: "DIRECT",
            easyPay: "TOSSPAY",
            useCardPoint: false,
            useAppCardOnly: false,
          },
        })) as unknown as TossPaymentConfirmResponse | TossPaymentFailResponse;

        // Toss Payments SDK 결제 실패 응답인지 판별
        if (isFailResponse(requestPaymentResponse)) {
          await failPayment(
            requestPaymentResponse.code,
            requestPaymentResponse.orderId,
            requestPaymentResponse.message,
          );
          throw new Error(requestPaymentResponse.message || "결제 요청이 실패했습니다.");
        }

        // Toss Payments SDK 결제 성공 응답인지 확인
        if (!isConfirmResponse(requestPaymentResponse)) {
          throw new Error("결제 요청 응답 형식이 올바르지 않습니다.");
        }

        // Toss Payments SDK 결제 필수 필드 검증
        if (
          !requestPaymentResponse.paymentKey ||
          !requestPaymentResponse.orderId ||
          !requestPaymentResponse.amount?.value
        ) {
          throw new Error("결제 요청에 실패했습니다.");
        }

        // 결제 승인 요청
        const confirmResponse = await confirmPayment(
          requestPaymentResponse.paymentKey,
          requestPaymentResponse.orderId,
          requestPaymentResponse.amount.value,
        );

        return confirmResponse;
      } catch (e) {
        const error = e instanceof Error ? e : new Error("주문 ID 요청에 실패했습니다.");
        setError(error);
        // 에러 상태로만 관리하고 throw하지 않음 (컴포넌트에서 error 상태를 감시하도록)
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [payment],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { isReady, isLoading, error, clearError, requestPayment };
}
