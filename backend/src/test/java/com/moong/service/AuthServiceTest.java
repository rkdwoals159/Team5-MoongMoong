package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.moong.controller.tool.jwt.JwtManager;
import com.moong.domain.member.MemberInfo;
import com.moong.dto.response.auth.JwtTokenResponse;
import com.moong.dto.response.auth.MemberInfoWithTokenResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class AuthServiceTest extends BaseServiceTest {

    @Autowired
    protected AuthService authService;

    @Autowired
    protected JwtManager jwtManager;

    @DisplayName("OAuth 회원정보와 회원토큰을 발급받을 수 있다")
    @Test
    void findMemberInfoAndGenerateToken() {
        MemberInfoWithTokenResponse memberAndToken = authService.findMemberInfoAndGenerateToken("accessToken");

        MemberInfo memberInfo = memberAndToken.memberInfo();
        JwtTokenResponse tokens = memberAndToken.jwtTokenResponse();
        assertAll(
                () -> assertThat(memberInfo.email()).isEqualTo(jwtManager.resolveAccessToken(tokens.accessToken())),
                () -> assertThat(memberInfo.email()).isEqualTo(jwtManager.resolveRefreshToken(tokens.refreshToken()))
        );
    }
}
