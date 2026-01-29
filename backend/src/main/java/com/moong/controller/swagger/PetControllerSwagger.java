package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode500;
import com.moong.domain.entity.Member;
import com.moong.dto.request.PetCreateRequest;
import com.moong.dto.response.pet.PetCreateResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Pet API")
public interface PetControllerSwagger {

    @Operation(
            summary = "반려동물 등록",
            description = "회원이 새로운 반려동물을 등록합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "반려동물 등록 성공",
            content = @Content(
                    schema = @Schema(implementation = PetCreateResponse.class)
            )
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<PetCreateResponse> savePet(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            PetCreateRequest petCreateRequest
    );
}
