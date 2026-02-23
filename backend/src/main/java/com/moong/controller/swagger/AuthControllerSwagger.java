package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode500;
import com.moong.domain.member.Member;
import com.moong.dto.request.auth.AuthLoginRequest;
import com.moong.dto.request.auth.AuthTokenRefreshRequest;
import com.moong.dto.response.auth.AuthLoginResponse;
import com.moong.dto.response.auth.AuthTokenRefreshResponse;
import com.moong.dto.response.auth.ConnectionTokenResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface AuthControllerSwagger {

    @Operation(summary = "로그인", description = """
            구글 OAuth 인증 후 로그인을 처리합니다.
            Authorization 헤더로 Access Token, Set-Cookie로 Refresh Token을 반환합니다.
            """
    )
    @ApiResponse(
            responseCode = "201",
            description = "로그인 성공",
            headers = {
                    @Header(name = "Authorization", description = "Bearer {accessToken}", schema = @Schema(type = "string")),
                    @Header(name = "Set-Cookie", description = "refreshToken={refreshToken};", schema = @Schema(type = "string"))
            }
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<AuthLoginResponse> login(AuthLoginRequest loginRequest);

    @Operation(summary = "토큰 재발급", description = "만료된 Access Token을 Refresh Token을 사용하여 재발급합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "토큰 재발급 성공",
            content = @Content(schema = @Schema(implementation = AuthTokenRefreshResponse.class))
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<AuthTokenRefreshResponse> refresh(AuthTokenRefreshRequest refreshRequest);

    @Operation(summary = "로그아웃", description = "현재 로그인된 사용자를 로그아웃 처리하고 Refresh Token을 무효화합니다.")
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<Void> logout(
            @Parameter(hidden = true)
            Member member,

            @Parameter(description = "무효화할 Refresh Token", required = true)
            String refreshToken
    );

    @Operation(summary = "Connection 토큰 발급", description = "Connection 토큰을 발급합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "유효한 Connection 토큰을 발급합니다.",
            content = @Content(schema = @Schema(implementation = ConnectionTokenResponse.class))
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<ConnectionTokenResponse> issueConnectionToken(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member
    );

    @Operation(summary = "로그아웃", description = "사용중인 토큰의 유효성을 판단합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "유효 토큰",
            headers = {
                    @Header(name = "Authorization", description = "Bearer {accessToken}", schema = @Schema(type = "string")),
            }
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<Void> validate(
            @Parameter(hidden = true)
            Member member
    );
}
