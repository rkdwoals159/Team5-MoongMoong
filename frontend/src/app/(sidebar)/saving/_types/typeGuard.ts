import { TossPaymentConfirmResponse, TossPaymentFailResponse } from "./tossPay";

// 타입 가드 함수: 실패 응답인지 판별
export function isFailResponse(
  response: TossPaymentConfirmResponse | TossPaymentFailResponse,
): response is TossPaymentFailResponse {
  return "code" in response && "message" in response;
}

// 타입 가드 함수: 성공 응답인지 판별
export function isConfirmResponse(
  response: TossPaymentConfirmResponse | TossPaymentFailResponse,
): response is TossPaymentConfirmResponse {
  return "paymentKey" in response && response.paymentKey !== undefined;
}
