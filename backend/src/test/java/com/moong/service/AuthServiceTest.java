package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.controller.tool.jwt.JwtManager;
import com.moong.domain.member.Member;
import com.moong.domain.member.MemberInfo;
import com.moong.dto.response.auth.JwtTokenResponse;
import com.moong.dto.response.auth.MemberInfoWithTokenResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.fixture.JwtTokenGenerator;
import com.moong.service.auth.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class AuthServiceTest extends BaseServiceTest {

    @Autowired
    protected AuthService authService;

    @Autowired
    protected JwtManager jwtManager;

    @Autowired
    private JwtTokenGenerator jwtTokenGenerator;

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

    @DisplayName("Connection 토큰으로 멤버를 조회할 수 있다.")
    @Test
    void authorizeByConnectionToken() {
        Member member = memberGenerator.generateSaved("테스트");
        String connectionToken = jwtTokenGenerator.generateConnectionToken(member);

        Member result = authService.authorizeByConnectionToken(connectionToken);

        assertAll(
                () -> assertThat(result.getId()).isEqualTo(member.getId()),
                () -> assertThat(result.getEmail()).isEqualTo(member.getEmail())
        );
    }

    @DisplayName("Connection으로 멤버를 조회를 실패한다.")
    @Test
    void connectionTokenIssueFail() {
        Member notSavedMember = new Member("test@email.com", "테스트2", "url");
        String connectionToken = jwtTokenGenerator.generateConnectionToken(notSavedMember);

        assertThatThrownBy(() -> authService.authorizeByConnectionToken(connectionToken))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.INVALID_CONNECTION_TOKEN.getMessage());
    }

    @DisplayName("토큰을 재발급할 수 있다")
    @Test
    void refreshTokenSuccess() {
        Member member = memberGenerator.generateSaved("김콜리");
        String refreshToken = jwtManager.createRefreshToken(new MemberInfo(member.getEmail()));

        JwtTokenResponse tokenResponse = authService.refreshToken(refreshToken);

        assertAll(
                () -> assertThat(jwtManager.resolveAccessToken(tokenResponse.accessToken()))
                        .isEqualTo(member.getEmail()),
                () -> assertThat(jwtManager.resolveRefreshToken(tokenResponse.refreshToken()))
                        .isEqualTo(member.getEmail())
        );
    }

    @DisplayName("로그아웃할 수 있다")
    @Test
    void logoutSuccess() {
        Member member = memberGenerator.generateSaved("김콜리");
        String refreshToken = jwtManager.createRefreshToken(new MemberInfo(member.getEmail()));

        assertThatCode(() -> authService.logout(member, refreshToken))
                .doesNotThrowAnyException();
    }

    @DisplayName("같은 회원이 아니면 인증에러가 발생한다")
    @Test
    void logoutFail() {
        Member geonwoo = memberGenerator.generateSaved("김건우");
        Member hyeon = memberGenerator.generateSaved("전현민");
        String geonwooRefreshToken = jwtManager.createRefreshToken(new MemberInfo(geonwoo.getEmail()));

        assertThatThrownBy(() -> authService.logout(hyeon, geonwooRefreshToken))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.UNAUTHORIZED_EXCEPTION.getMessage());
    }
}
