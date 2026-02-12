package com.moong.dto.response.pet;

import com.moong.domain.entity.Pet;
import com.moong.domain.entity.WorriedDisease;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.YearMonth;
import java.util.List;

@Schema(description = "반려동물 정보 응답")
public record PetReadResponse(
        @Schema(description = "반려동물 아이디", example = "1")
        long petId,

        @Schema(description = "반려동물 이름", example = "초코")
        String petName,

        @Schema(description = "반려동물 종류", example = "DAS")
        Breed breed,

        @Schema(description = "성별", example = "M")
        Gender gender,

        @Schema(implementation = String.class, example = "2026-02", pattern = "yyyy-MM")
        YearMonth birthDate,

        @Schema(description = "거주 시", example = "서울시")
        String city,

        @Schema(description = "거주 구역", example = "종로구")
        String district,

        @Schema(description = "우려하는 질병 목록", example = "[\"OCU\", \"MUS\"]")
        List<Disease> diseases
) {

    public PetReadResponse(Pet pet, List<WorriedDisease> worriedDiseases) {
        this(
                pet.getId(),
                pet.getName(),
                pet.getBreed(),
                pet.getGender(),
                YearMonth.of(pet.getBirthDate().getYear(), pet.getBirthDate().getMonthValue()),
                pet.getCity(),
                pet.getDistrict(),
                worriedDiseases.stream()
                        .map(WorriedDisease::getDisease)
                        .toList()
        );
    }
}

