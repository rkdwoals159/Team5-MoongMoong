package com.moong.dto.request.auth;

public record AuthLoginRequest(
        String accessToken,
        String inviteUrl
) {

    public boolean hasInviteUrl() {
        return inviteUrl != null;
    }
}
