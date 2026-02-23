package com.moong.dto.response.member;

import com.moong.domain.member.Member;

public record MemberUpdateProfileResponse(
        long memberId,
        String memberName,
        String memberImageUrl
) {

    public MemberUpdateProfileResponse(Member member) {
        this(member.getId(), member.getName(), member.getImageUrl());
    }
}
