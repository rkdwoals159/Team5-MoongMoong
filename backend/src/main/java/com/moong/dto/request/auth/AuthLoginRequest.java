package com.moong.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "로그인 요청")
public record AuthLoginRequest(
        @Schema(description = "Google OAuth 엑세스 토큰", example = "google access")
        @NotBlank(message = "엑세스 토큰은 빈 값일 수 없습니다")
        String accessToken,

        @Schema(description = "초대 코드 url(없을 시 null)", example = "https://moong.site/invite/123")
        @Nullable
        String inviteUrl
) {

    public boolean hasInviteUrl() {
        return inviteUrl != null;
    }
}
