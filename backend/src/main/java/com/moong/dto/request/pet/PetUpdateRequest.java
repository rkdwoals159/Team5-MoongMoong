package com.moong.dto.request.pet;

import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.YearMonth;
import java.util.List;

@Schema(description = "반려동물 수정 요청")
public record PetUpdateRequest(

        @Schema(description = "반려동물 이름", example = "초코")
        @NotBlank(message = "펫 이름이 빈 값일 수 없습니다")
        String petName,

        @Schema(description = "반려동물 종류", example = "DAS")
        @NotNull(message = "반려동물 종류는 필수입니다")
        Breed breed,

        @Schema(description = "성별", example = "M", nullable = false)
        @NotNull(message = "성별은 필수입니다")
        Gender gender,

        @Schema(implementation = String.class, example = "2026-02", pattern = "yyyy-MM")
        @NotNull(message = "생년월은 필수입니다")
        YearMonth birthDate,

        @Schema(description = "거주 시", example = "서울시")
        @NotBlank(message = "거주 시는 필수입니다")
        String city,

        @Schema(description = "거주 구역", example = "종로구")
        String district,

        @Schema(description = "우려하는 질병 목록", example = "[\"OCU\", \"MUS\"]")
        @NotNull(message = "질병 목록은 null일 수 없습니다")
        List<Disease> diseases
) {
}
