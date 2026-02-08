package com.moong.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "로그인 요청")
public record AuthLoginRequest(
        @Schema(description = "Google OAuth 엑세스 토큰", example = "google access")
        String accessToken,

        @Schema(description = "초대 코드 url(없을 시 null)", example = "https://moong.site/invite/123")
        String inviteUrl
) {

    public boolean hasInviteUrl() {
        return inviteUrl != null;
    }
}
