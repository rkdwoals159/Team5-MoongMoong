package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode400;
import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode500;
import com.moong.domain.member.Member;
import com.moong.dto.request.petgroup.PetGroupParticipateRequest;
import com.moong.dto.response.petgroup.GroupCrewResponse;
import com.moong.dto.response.petgroup.PetGroupParticipateResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Pet Group API")
public interface PetGroupControllerSwagger {

    @Operation(
            summary = "그룹 초대 참여",
            description = "초대 URL을 통해 펫 그룹에 참여합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "그룹 참여 성공",
            content = @Content(schema = @Schema(implementation = PetGroupParticipateResponse.class))
    )
    @ErrorCode400( description = """
        다음과 같은 경우 그룹 참여가 실패합니다.
        - 잘못된 초대 URL
        - 이미 참여한 그룹
        - 그룹 정원이 모두 찬 경우
        - 이미 다른 그룹에 참여 중인 경우 (2명 이상 구성원 보유)
        """
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<PetGroupParticipateResponse> participate(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            PetGroupParticipateRequest request
    );

    @Operation(
            summary = "그룹 모임원 조회",
            description = "현재 사용자가 속한 펫 그룹의 모임원 목록과 초대 URL을 조회합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "모임원 조회 성공",
            content = @Content(schema = @Schema(implementation = GroupCrewResponse.class))
    )
    @ErrorCode400(
            description = """
                다음과 같은 경우 조회가 실패합니다.
                - 사용자가 그룹에 속해있지 않은 경우
        """
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<GroupCrewResponse> getCrews(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member
    );
}
