package com.moong.dto.response.member;

import com.moong.domain.entity.Member;

public record MemberInfoResponse(
        String memberName,
        String memberImageUrl
) {

    public static final String TEMP_MEMBER_IMAGE_URL = "https://avatars.githubusercontent.com/u/148152234?v=4"; //임시 회원 url

    //TODO S3 추가 이후 수정
    public MemberInfoResponse(Member member) {
        this(member.getName(), TEMP_MEMBER_IMAGE_URL);
    }




}
