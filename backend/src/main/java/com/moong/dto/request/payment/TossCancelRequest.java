package com.moong.dto.request.payment;

public record TossCancelRequest(
        String cancelReason
) {
    public static TossCancelRequest forInternalError() {
        return new TossCancelRequest("서버 내부 로직 처리 실패(자동 취소)");
    }
}
