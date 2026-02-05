package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode500;
import com.moong.domain.entity.Member;
import com.moong.dto.response.member.MemberInfoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
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
    ResponseEntity<MemberInfoResponse> findMember(Member member);
}
