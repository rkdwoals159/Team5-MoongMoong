package com.moong.controller.swagger;

import com.moong.annotation.auth.AuthMember;
import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode500;
import com.moong.domain.entity.Member;
import com.moong.dto.request.member.MemberUpdateNameRequest;
import com.moong.dto.request.member.MemberUpdateProfileRequest;
import com.moong.dto.request.memberexpense.MemberExpensesUpsertRequest;
import com.moong.dto.response.member.MemberInfoResponse;
import com.moong.dto.response.member.MemberUpdateNameResponse;
import com.moong.dto.response.member.MemberUpdateProfileResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

@Tag(name = "Member API")
public interface MemberControllerSwagger {

    @Operation(
            summary = "회원 정보 반환",
            description = "회원 닉네임과 이미지 url을 반환합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "회원정보 반환 성공",
            content = @Content(
                    schema = @Schema(implementation = MemberInfoResponse.class)
            )
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<MemberInfoResponse> findMember(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member
    );

    @Operation(
            summary = "회원 프로필 업데이트 요청",
            description = "회원 프로필을 업데이트합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "회원 프로필 업데이트 성공",
            content = @Content(
                    schema = @Schema(implementation = MemberUpdateProfileResponse.class)
            )
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<MemberUpdateProfileResponse> updateProfile(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            @RequestBody(
                    description = "회원 프로필 업데이트 요청",
                    content = @Content(schema = @Schema(implementation = MemberUpdateProfileRequest.class))
            )
            MemberUpdateProfileRequest request
    );

    @Operation(
            summary = "회원 닉네임 업데이트 요청",
            description = "회원 닉네임을 업데이트합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "회원 닉네임 업데이트 성공",
            content = @Content(
                    schema = @Schema(implementation = MemberUpdateNameResponse.class)
            )
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<MemberUpdateNameResponse> updateName(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            @RequestBody(
                    description = "회원 닉네임 업데이트 요청",
                    content = @Content(schema = @Schema(implementation = MemberUpdateNameRequest.class))
            )
            MemberUpdateNameRequest request
    );
}
