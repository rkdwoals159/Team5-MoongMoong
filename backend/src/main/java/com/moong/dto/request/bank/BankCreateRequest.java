package com.moong.dto.request.bank;

import com.moong.domain.entity.Bank;
import com.moong.domain.entity.PetGroup;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "저금통 생성 요청")
public record BankCreateRequest(
        @Schema(description = "저금통 목표 금액", example = "1500000")
        long target
) {
        public Bank toBank(PetGroup petGroup) {
                return new Bank(
                        petGroup,
                        target
                );
        }
}
