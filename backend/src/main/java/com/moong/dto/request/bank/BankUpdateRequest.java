package com.moong.dto.request.bank;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "저금통 목표 금액 변경 요청")
public record BankUpdateRequest(
        @Schema(description = "저금통 목표 금액", example = "1500000")
        long target
) {

}
