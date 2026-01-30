package com.moong.dto.response.bank;

import com.moong.domain.bank.CoinView;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "저금통 코인 내역 조회 응답")
public record CoinsResponse(
        @ArraySchema(
                schema = @Schema(implementation = CoinResponse.class),
                arraySchema = @Schema(description = "저금통 코인 내역 리스트"))
        List<CoinResponse> coins
) {

    public static CoinsResponse from(List<CoinView> coinViews) {
        List<CoinResponse> coinResponses = coinViews.stream()
                .map(CoinResponse::new)
                .toList();
        return new CoinsResponse(coinResponses);
    }
}
