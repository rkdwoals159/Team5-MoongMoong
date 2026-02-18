package com.moong.dto.response.member;

import com.moong.domain.entity.Member;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "회원 정보 응답")
public record MemberInfoResponse(

        @Schema(description = "회원 닉네임", example = "커피내기장인 콜리")
        String memberName,

        @Schema(description = "회원 이메일", example = "kkwoo001021@naver.com")
        String memberEmail,

        @Schema(description = "회원 프로필 이미지 url", example = "S3 image Url")
        String memberImageUrl
) {

    public static final String TEMP_MEMBER_IMAGE_URL = "https://avatars.githubusercontent.com/u/148152234?v=4"; //임시 회원 url

    //TODO S3 추가 이후 수정
    public MemberInfoResponse(Member member) {
        this(
                member.getName(),
                member.getEmail(),
                TEMP_MEMBER_IMAGE_URL
        );
    }
}
