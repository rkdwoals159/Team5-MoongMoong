package com.moong.dto.response.bank;

import com.moong.domain.ranking.BankRanking;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "저금통 랭킹 정보")
public record BankRankingResponse(
        @Schema(description = "사용자 이름", example = "건우")
        String userName,

        @Schema(description = "누적 저축 금액", example = "150000")
        long total
) {

    public BankRankingResponse(BankRanking bankRanking) {
        this(bankRanking.getMemberName(), bankRanking.getTotal());
    }
}
