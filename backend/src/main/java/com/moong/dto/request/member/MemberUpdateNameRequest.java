package com.moong.dto.request.member;

import com.moong.domain.member.MemberName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "회원 닉네임 업데이트 요청")
public record MemberUpdateNameRequest(
        @Schema(description = "회원 닉네임", example = "john koo")
        @NotBlank(message = "닉네임 업데이트 요청 - 회원 닉네임은 빈 값일 수 없습니다.")
        String memberName
) {

    public MemberName toName() {
        return new MemberName(memberName);
    }
}
