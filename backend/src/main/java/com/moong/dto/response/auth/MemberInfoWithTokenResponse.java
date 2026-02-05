package com.moong.dto.response.auth;

import com.moong.domain.member.MemberInfo;

public record MemberInfoWithTokenResponse(
        MemberInfo memberInfo,
        JwtTokenResponse jwtTokenResponse
) {

}
