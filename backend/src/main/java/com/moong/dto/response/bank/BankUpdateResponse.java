package com.moong.dto.response.bank;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "저금통 목표 금액 변경 응답")
public record BankUpdateResponse(
        @Schema(description = "저금통 목표 금액", example = "1500000")
        long target
) {

}
