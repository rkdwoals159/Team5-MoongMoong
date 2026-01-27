package com.moong.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "그룹 초대 요청")
public record PetGroupParticipateRequest(

        @Schema(description = "초대코드 url", example = "https://moong.site/invite/RRJ2A2gf4I9pSxpW6F1byH2RGEweYjpmZOGasbaXvOGtHCwq")
        String inviteUrl
) {

}
