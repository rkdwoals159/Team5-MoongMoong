package com.moong.dto.response.member;

import com.moong.domain.member.Member;

public record MemberReadResponse(
        boolean isNew,
        Member member
) {

}
