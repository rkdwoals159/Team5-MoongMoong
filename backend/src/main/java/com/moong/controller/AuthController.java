package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.AuthControllerSwagger;
import com.moong.controller.tool.cookie.CookieManager;
import com.moong.domain.entity.Member;
import com.moong.dto.request.auth.AuthLoginRequest;
import com.moong.dto.request.auth.AuthTokenRefreshRequest;
import com.moong.dto.response.auth.AuthLoginResponse;
import com.moong.dto.response.auth.AuthTokenRefreshResponse;
import com.moong.dto.response.auth.JwtTokenResponse;
import com.moong.dto.response.member.FacadeLoginResponse;
import com.moong.facade.auth.AuthFacadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController implements AuthControllerSwagger {

    private static final String REFRESH_TOKEN_COOKIE_KEY = "refreshToken";

    private final AuthFacadeService authFacadeService;
    private final CookieManager cookieManager;

    @Override
    @PostMapping("/api/auth/login")
    public ResponseEntity<AuthLoginResponse> login(@RequestBody AuthLoginRequest loginRequest) {
        FacadeLoginResponse loginResponse = authFacadeService.login(loginRequest);
        AuthLoginResponse response = new AuthLoginResponse(loginResponse);

        ResponseCookie refreshTokenCookie = cookieManager.createCookie(
                REFRESH_TOKEN_COOKIE_KEY,
                loginResponse.refreshToken(),
                loginResponse.refreshTokenExpiration()
        );

        return ResponseEntity.status(HttpStatus.OK)
                .headers(httpHeaders -> httpHeaders.setBearerAuth(loginResponse.accessToken()))
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(response);
    }

    @Override
    @PostMapping("/api/auth/refresh")
    public ResponseEntity<AuthTokenRefreshResponse> refresh(@RequestBody AuthTokenRefreshRequest refreshRequest) {
        JwtTokenResponse jwtTokens = authFacadeService.refreshToken(refreshRequest);
        ResponseCookie refreshTokenCookie = cookieManager.createCookie(
                REFRESH_TOKEN_COOKIE_KEY,
                jwtTokens.refreshToken(),
                jwtTokens.refreshTokenExpiration()
        );

        return ResponseEntity.ok()
                .headers(httpHeaders -> httpHeaders.setBearerAuth(jwtTokens.accessToken()))
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .build();
    }

    @Override
    @PostMapping("/api/auth/logout")
    public ResponseEntity<Void> logout(
            @AuthMember Member member,
            @CookieValue(name = REFRESH_TOKEN_COOKIE_KEY) String refreshToken
    ) {
        authFacadeService.logout(member, refreshToken);
        ResponseCookie expiredCookie = cookieManager.createExpiredCookie(REFRESH_TOKEN_COOKIE_KEY);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, expiredCookie.toString())
                .build();
    }

    @Override
    @GetMapping("/api/auth/validate")
    public ResponseEntity<Void> validate(
            @AuthMember Member member
    ) {
        return ResponseEntity.ok().build();
    }
}
