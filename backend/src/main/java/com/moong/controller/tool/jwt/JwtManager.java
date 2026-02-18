package com.moong.controller.tool.jwt;

import com.moong.domain.member.MemberInfo;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import java.time.Duration;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@EnableConfigurationProperties({JwtProperties.class, SseTokenProperties.class})
public class JwtManager {

    private static final String JWT_TOKEN_TYPE_KEY = "type";

    private final JwtProperties jwtProperties;
    private final SseTokenProperties sseTokenProperties;

    public String createConnectToken(MemberInfo memberInfo) {
        Duration accessTokenExpiration = sseTokenProperties.expiration();
        return createToken(memberInfo, accessTokenExpiration, TokenType.CONNECT_TOKEN);
    }

    public String createAccessToken(MemberInfo memberInfo) {
        Duration accessTokenExpiration = jwtProperties.accessTokenExpiration();
        return createToken(memberInfo, accessTokenExpiration, TokenType.ACCESS_TOKEN);
    }

    public String createRefreshToken(MemberInfo memberInfo) {
        Duration refreshTokenExpiration = jwtProperties.refreshTokenExpiration();
        return createToken(memberInfo, refreshTokenExpiration, TokenType.REFRESH_TOKEN);
    }

    private String createToken(MemberInfo memberInfo, Duration expiration, TokenType tokenType) {
        Date now = new Date();
        Date expiredDate = new Date(now.getTime() + expiration.toMillis());
        return Jwts.builder()
                .setSubject(memberInfo.email())
                .setIssuedAt(now)
                .setExpiration(expiredDate)
                .claim(JWT_TOKEN_TYPE_KEY, tokenType.name())
                .signWith(jwtProperties.getSecretKey())
                .compact();
    }

    public Duration getRefreshTokenExpiration() {
        return jwtProperties.refreshTokenExpiration();
    }

    public String resolveConnectionToken(String connectionToken) {
        return resolveToken(connectionToken, TokenType.CONNECT_TOKEN);
    }

    public String resolveAccessToken(String accessToken) {
        return resolveToken(accessToken, TokenType.ACCESS_TOKEN);
    }

    public String resolveRefreshToken(String refreshToken) {
        return resolveToken(refreshToken, TokenType.REFRESH_TOKEN);
    }

    private String resolveToken(String token, TokenType tokenType) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtProperties.getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            validateTokenType(claims, tokenType);
            return claims.getSubject();
        } catch (ExpiredJwtException exception) {
            throw new BusinessException(ErrorCode.EXPIRED_TOKEN);
        } catch (JwtException exception) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_EXCEPTION);
        }
    }

    private void validateTokenType(Claims claims, TokenType tokenType) {
        String extractTokenType = claims.get(JWT_TOKEN_TYPE_KEY, String.class);
        if (!extractTokenType.equals(tokenType.name())) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_EXCEPTION);
        }
    }
}
