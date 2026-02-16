package com.moong.dto.request.bank;

import com.moong.domain.entity.Bank;
import com.moong.domain.entity.PetGroup;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Positive;

@Schema(description = "저금통 생성 요청")
public record BankCreateRequest(
        @Schema(description = "저금통 목표 금액", example = "1500000")
        @Positive(message = "저금통 생성 요청 -저금통 목표 금액은 음수일 수 없습니다")
        long target
) {
    public Bank toBank(PetGroup petGroup) {
        return new Bank(
                petGroup,
                target
        );
    }
}
