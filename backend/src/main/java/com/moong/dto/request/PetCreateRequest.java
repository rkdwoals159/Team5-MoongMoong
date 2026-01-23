package com.moong.dto.request;

import com.moong.domain.entity.Pet;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Schema(description = "반려동물 생성 요청")
public record PetCreateRequest(
        @Schema(description = "반려동물 이름", example = "초코")
        String petName,

        @Schema(description = "반려동물 종류", example = "DAS")
        Breed breed,

        @Schema(description = "성별", example = "M")
        Gender gender,

        @Schema(description = "생년 월", example = "2026-02")
        YearMonth birthDate,

        @Schema(description = "거주 시", example = "서울시")
        String city,

        @Schema(description = "거주 구역", example = "종로주")
        String district,

        @Schema(description = "우려하는 질병 목록", example = "OCU, MUS")
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
