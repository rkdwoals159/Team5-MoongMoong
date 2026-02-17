package com.moong.dto.response.member;

import com.moong.domain.entity.Member;

public record MemberUpdateNameResponse(
        long memberId,
        String memberName,
        String memberImageUrl
) {

    public MemberUpdateNameResponse(Member member) {
        this(member.getId(), member.getName(), member.getImageUrl());
    }
}
