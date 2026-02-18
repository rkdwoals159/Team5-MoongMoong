package com.moong.dto.response.bank;

import com.moong.view.bank.CoinView;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "코인 내역")
public record CoinResponse(
        @Schema(description = "저금한 멤버 닉네임", example = "코코맘")
        String name,

        @Schema(description = "저금한 금액", example = "5000")
        long amount,

        @Schema(description = "생성 일자", example = "2026-01-30T14:32:15.123+09:00")
        LocalDateTime createdAt
) {
    public CoinResponse(CoinView coinView) {
        this(coinView.getName(), coinView.getAmount(), coinView.getCreatedAt());
    }
}
