package com.moong.dto.response.auth;

import java.time.Duration;

public record JwtTokenResponse(
        String accessToken,
        String refreshToken,
        Duration refreshTokenExpiration
) {

}
