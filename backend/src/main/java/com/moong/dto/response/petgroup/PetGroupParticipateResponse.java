package com.moong.dto.response.petgroup;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "참여 완료 응답")
public record PetGroupParticipateResponse(

        @Schema(description = "참여자 id", example = "1")
        long crewId
) {

}
