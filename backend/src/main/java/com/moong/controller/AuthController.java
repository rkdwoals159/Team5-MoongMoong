package com.moong.controller;

import com.moong.controller.tool.cookie.CookieManager;
import com.moong.dto.request.auth.AuthLoginRequest;
import com.moong.dto.response.auth.AuthLoginResponse;
import com.moong.dto.response.member.FacadeLoginResponse;
import com.moong.facade.auth.AuthFacadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private static final String REFRESH_TOKEN_COOKIE_KEY = "refreshToken";

    private final AuthFacadeService authFacadeService;
    private final CookieManager cookieManager;

    @PostMapping("/api/auth/login")
    public ResponseEntity<AuthLoginResponse> login(@RequestBody AuthLoginRequest loginRequest) {
        FacadeLoginResponse loginResponse = authFacadeService.login(loginRequest);
        AuthLoginResponse response = new AuthLoginResponse(loginResponse);

        ResponseCookie refreshTokenCookie = cookieManager.createCookie(
                REFRESH_TOKEN_COOKIE_KEY,
                loginResponse.tokenResponse().refreshToken(),
                loginResponse.tokenResponse().refreshTokenExpiration()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.AUTHORIZATION, loginResponse.tokenResponse().accessToken())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(response);
    }
}
