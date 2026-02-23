package com.moong.dto.response.bank;

import com.moong.domain.bank.Coin;
import com.moong.domain.member.Member;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "저금하기 응답")
public record CoinCreateResponse(
        @Schema(description = "저금 내역 ID", example = "1")
        long coinId,

        @Schema(description = "생성 일자", example = "2026-01-30T14:32:15.123+09:00")
        LocalDateTime createdAt,

        @Schema(description = "저금 금액", example = "5000")
        long amount,

        @Schema(description = "저금한 사람", example = "민수")
        String name
) {
    public CoinCreateResponse(Coin coin, Member member) {
        this(
                coin.getId(),
                coin.getCreatedAt(),
                coin.getAmount(),
                member.getName()
        );
    }
}
