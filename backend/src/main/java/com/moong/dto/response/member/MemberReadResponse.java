package com.moong.dto.response.member;

import com.moong.domain.entity.Member;

public record MemberReadResponse(
        boolean isNew,
        Member member
) {

}
