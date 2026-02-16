package com.moong.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "토큰 재발급 요청")
public record AuthTokenRefreshRequest(
        @Schema(description = "만료된 Access Token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
        @NotBlank(message = "만료된 엑세스 토큰은 빈 값일 수 없습니다")
        String accessToken,

        @Schema(description = "유효한 Refresh Token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.cThIIoDvwdueQB4NgjKBAI")
        @NotBlank(message = "리프레시 토큰은 빈 값일 수 없습니다")
        String refreshToken
) {

}
