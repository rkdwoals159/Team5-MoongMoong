package com.moong.dto.response.bank;

import com.moong.view.message.BankBreakMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

@Schema(description = "저금통 깨기 응답")
public record BankBreakResponse(
        @Schema(description = "저금통을 유지한 총 일수", example = "42")
        long days,

        @Schema(description = "저금통을 깼을 때 출력되는 축하 메시지", example = "축하해요! 저금통이 열렸어요!")
        String message
) {

    public BankBreakResponse(LocalDateTime bankCreatedAt) {
        this(
                Period.between(
                        bankCreatedAt.toLocalDate(),
                                LocalDate.now()
                        )
                        .getDays(),
                BankBreakMessage.getRandom().getMessage()
        );
    }
}
