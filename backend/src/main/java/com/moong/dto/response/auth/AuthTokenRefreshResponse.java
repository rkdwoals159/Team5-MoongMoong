package com.moong.dto.response.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Duration;

@Schema(description = "토큰 재발급 응답")
public record AuthTokenRefreshResponse(
        @Schema(description = "새로 발급된 Access Token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
        String accessToken,

        @Schema(description = "새로 발급된 Refresh Token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.cThIIoDvwdueQB4NgjKBAI")
        String refreshToken,

        @Schema(description = "Refresh Token 만료까지 남은 시간 (ISO-8601 Duration 형식)", example = "PT168H", implementation = String.class)
        Duration refreshTokenExpiration
) {

}
