package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode404;
import com.moong.annotation.swagger.ErrorCode500;
import com.moong.domain.entity.Member;
import com.moong.domain.enums.Disease;
import com.moong.dto.response.groupmedical.GroupMedicalInfoResponse;
import com.moong.dto.response.groupmedical.GroupMedicalStatisticsResponse;
import com.moong.dto.response.groupmedical.PetDiseaseRankingResponse;
import com.moong.dto.response.groupmedical.TreatmentsResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "GroupMedical API")
public interface GroupMedicalControllerSwagger {

    @Operation(
            summary = "그룹 의사 권장사항 반환",
            description = """
                    로그인한 사용자가 속한 모임의 반려동물 AI 의료 권장사항과
                    내년 연간 예상 비용을 조회합니다.
                    """
    )
    @ApiResponse(
            responseCode = "200",
            description = "그룹 의사 권장사항 반환 성공",
            content = @Content(
                    schema = @Schema(implementation = GroupMedicalInfoResponse.class))
    )
    @ErrorCode401
    @ErrorCode404(description = "AI 의사 권장사항 생성 중")
    @ErrorCode500
    ResponseEntity<GroupMedicalInfoResponse> getGroupMedicalInfo(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member
    );

    @Operation(
            summary = "특정 질병의 의료비 데이터 리스트 반환",
            description = """
                         특정 질병의 치료법들에 대해 각 치료법의 진료명, 상세 진료 설명,
                         그리고 치료비의 최소·최대·평균값을 조회합니다.
                         """
    )
    @ApiResponse(
            responseCode = "200",
            description = "특정 질병의 의료비 데이터 리스트 반환 성공",
            content = @Content(
                    schema = @Schema(implementation = TreatmentsResponse.class))
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<TreatmentsResponse> getTreatment(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            Disease disease
    );

    @Operation(
            summary = "그룹 질병 통계 조회",
            description = "회원이 속한 그룹의 질병별 연도 통계 데이터를 조회합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(
                    schema = @Schema(implementation = GroupMedicalStatisticsResponse.class)
            )
    )
    ResponseEntity<GroupMedicalStatisticsResponse> findGroupDieseaseStatistics(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member
    );

    @Operation(
            summary = "올해 기준 발병확률 순 질병 목록 반환",
            description = """
                    사용자의 펫 데이터를 통해 가장 주의해야할 질병부터 순서대로 반환합니다.
                    """
    )
    @ApiResponse(
            responseCode = "200",
            description = "사용자의 그룹에 속한 펫의 발병확률 순 질병 목록 반환",
            content = @Content(
                    schema = @Schema(implementation = PetDiseaseRankingResponse.class))
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<PetDiseaseRankingResponse> findPetDiseaseRanking(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member
    );
}
