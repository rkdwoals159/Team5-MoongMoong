import type {
  BankCreateResponse,
  BankUpdateResponse,
  BankBreakResponse,
  ConfirmPaymentResponse,
  OrderIdResponse,
} from "@/api/types/savingApi.type";

// 저금통 생성
export async function createNewSaving(target: number): Promise<BankCreateResponse | null> {
  const res = await fetch("/api/saving/bank", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target }),
  });
  if (!res.ok) return null;
  return res.json();
}

// 저금통 목표 금액 수정
export async function updateSavingTarget(target: number): Promise<BankUpdateResponse | null> {
  const res = await fetch("/api/saving/bank", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target }),
  });
  if (!res.ok) return null;
  return res.json();
}

// 저금통 깨기
export async function breakSaving(): Promise<BankBreakResponse | null> {
  const res = await fetch("/api/saving/bank", { method: "DELETE" });
  if (!res.ok) return null;
  return res.json();
}

// 결제 ID 요청
export async function requestOrderId(amount: number): Promise<OrderIdResponse> {
  const res = await fetch("/api/saving/coins", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error("결제 요청에 실패했습니다.");
  return res.json();
}

// 결제 확인
export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number,
): Promise<ConfirmPaymentResponse> {
  const res = await fetch("/api/saving/coins/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });
  if (!res.ok) throw new Error("결제 확인에 실패했습니다.");
  return res.json();
}

// 결제 실패 보고
export async function failPayment(code: string, orderId: string, message: string): Promise<void> {
  const res = await fetch("/api/saving/coins/fail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, orderId, message }),
  });
  if (!res.ok) throw new Error("결제 처리에 실패했습니다.");
}
