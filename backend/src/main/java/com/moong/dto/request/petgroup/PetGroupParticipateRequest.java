package com.moong.dto.request.petgroup;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "그룹 초대 요청")
public record PetGroupParticipateRequest(

        @Schema(description = "초대코드 url", example = "https://moong.site/invite/RRJ2A2gf4I9pSxpW6F1byH2RGEweYjpmZOGasbaXvOGtHCwq")
        @NotBlank(message = "그룹 초대 요청 - 초대코드 URL은 빈 값일 수 없습니다")
        String inviteUrl
) {

}
