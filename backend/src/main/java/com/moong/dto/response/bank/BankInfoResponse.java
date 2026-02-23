package com.moong.dto.response.bank;

import com.moong.domain.ranking.BankRankings;
import com.moong.domain.bank.Bank;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public record BankInfoResponse(
        @Schema(description = "저금통 ID", example = "1")
        long bankId,

        @Schema(description = "현재 저축 금액", example = "75000")
        long current,

        @Schema(description = "목표 저축 금액", example = "200000")
        long target,

        @ArraySchema(schema = @Schema(implementation = BankRankingResponse.class))
        List<BankRankingResponse> rankings
) {
    public BankInfoResponse(Bank bank, BankRankings bankRankings) {
        this(
                bank.getId(),
                bank.getCurrentAmount(),
                bank.getTargetAmount(),
                bankRankings.getValues().stream()
                        .map(BankRankingResponse::new)
                        .toList()
        );
    }

}
