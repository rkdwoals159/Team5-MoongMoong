package com.moong.dto.request.member;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "회원 프로필 업데이트 요청")
public record MemberUpdateProfileRequest(
        @Schema(description = "회원 프로필", example = "http://~~~")
        @NotBlank(message = "회원 프로필 변경 - 회원 프로필 url은 빈값일 수 없습니다")
        String memberImageUrl
) {

}
