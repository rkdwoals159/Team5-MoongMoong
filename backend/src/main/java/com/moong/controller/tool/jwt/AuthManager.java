package com.moong.controller.tool.jwt;

import com.moong.domain.member.MemberInfo;
import com.moong.dto.response.auth.JwtTokenResponse;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthManager {

    private final JwtManager jwtManager;

    public JwtTokenResponse issueToken(MemberInfo memberInfo) {
        String accessToken = jwtManager.createAccessToken(memberInfo);
        String refreshToken = jwtManager.createRefreshToken(memberInfo);
        Duration refreshTokenExpiration = jwtManager.getRefreshTokenExpiration();
        return new JwtTokenResponse(accessToken, refreshToken, refreshTokenExpiration);
    }

    public JwtTokenResponse reissueToken(String refreshToken) {
        String email = jwtManager.resolveRefreshToken(refreshToken);
        MemberInfo memberInfo = new MemberInfo(email);

        String accessToken = jwtManager.createAccessToken(memberInfo);
        String newRefreshToken = jwtManager.createRefreshToken(memberInfo);
        Duration refreshTokenExpiration = jwtManager.getRefreshTokenExpiration();
        return new JwtTokenResponse(accessToken, newRefreshToken, refreshTokenExpiration);
    }

    public String resolveAccessToken(String accessToken) {
        return jwtManager.resolveAccessToken(accessToken);
    }

    public String resolveRefreshToken(String refreshToken) {
        return jwtManager.resolveRefreshToken(refreshToken);
    }
}
