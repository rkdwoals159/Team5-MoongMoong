package com.moong.dto.response.auth;

import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Gender;
import com.moong.dto.response.member.FacadeLoginResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.YearMonth;

@Schema(description = "로그인 응답")
public record AuthLoginResponse(
        @Schema(description = "초대된 회원인지 여부", example = "true")
        boolean isInvited,

        @Schema(description = "신규회원 여부", example = "true")
        boolean isNew,

        @Schema(description = "그룹 소속 여부", example = "true")
        boolean hasGroup,

        @Schema(description = "회원 ID", example = "102345")
        long memberId,

        @Schema(description = "임의 생성된 회원 닉네임", example = "행복한펭귄42")
        String name,

        @Schema(description = "회원 프로필 URL", example = "https://cdn.example.com/profile/default_01.png")
        String imageUrl,

        @Schema(description = "강아지 이름 (초대되지 않은 경우 null)", example = "코코", nullable = true)
        String petName,

        @Schema(description = "견종 코드 (초대되지 않은 경우 null)", example = "BEA", nullable = true)
        Breed breed,

        @Schema(description = "강아지 성별 (M: 남아, F: 여아, 초대되지 않은 경우 null)", example = "M", nullable = true)
        Gender gender,

        @Schema(implementation = String.class, example = "2026-02", pattern = "yyyy-MM")
        YearMonth birthDate
) {

    public AuthLoginResponse(FacadeLoginResponse loginResponse) {
        this(
                loginResponse.isInvited(),
                loginResponse.isNew(),
                loginResponse.hasGroup(),
                loginResponse.memberId(),
                loginResponse.name(),
                loginResponse.imageUrl(),
                loginResponse.invitedPetResponse().petName(),
                loginResponse.invitedPetResponse().breed(),
                loginResponse.invitedPetResponse().gender(),
                loginResponse.invitedPetResponse().birthDate()
        );
    }
}
