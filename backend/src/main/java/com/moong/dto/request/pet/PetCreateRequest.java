package com.moong.dto.request.pet;

import com.moong.domain.entity.Pet;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Schema(description = "반려동물 생성 요청")
public record PetCreateRequest(
        @Schema(description = "반려동물 이름", example = "초코")
        @NotBlank(message = "반려동물 생성 요청 - 펫 이름은 빈 값일 수 없습니다")
        String petName,

        @Schema(description = "반려동물 종류", example = "DAS")
        @NotNull(message = "반려동물 생성 요청 - 반려동물 종류는 null일 수 없습니다")
        Breed breed,

        @Schema(description = "성별", example = "M")
        @NotNull(message = "반려동물 생성 요청 - 반려동물 성별은 null일 수 없습니다")
        Gender gender,

        @Schema(implementation = String.class, example = "2026-02", pattern = "yyyy-MM")
        @NotNull(message = "반려동물 생성 요청 - 반려동물 생년 월일은 null일 수 없습니다")
        YearMonth birthDate,

        @Schema(description = "거주 시", example = "서울시")
        @NotBlank(message = "반려동물 생성 요청 - 거주 시는 빈 값일 수 없습니다")
        String city,

        @Schema(description = "거주 구역", example = "종로구")
        @NotBlank(message = "반려동물 생성 요청 - 거주 구역은 빈 값일 수 없습니다")
        String district,

        @Schema(description = "우려하는 질병 목록", example = "OCU, MUS")
        @NotNull(message = "반려동물 생성 요청 - 우려 질병 목록은 null일 수 없습니다")
        List<Disease> diseases
) {
    public Pet toPet() {
        return new Pet(
                null,
                petName,
                breed,
                gender,
                LocalDate.of(birthDate.getYear(), birthDate.getMonth(), 1),
                city,
                district
        );
    }
}
