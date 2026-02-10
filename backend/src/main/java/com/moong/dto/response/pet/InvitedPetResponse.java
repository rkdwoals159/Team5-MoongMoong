package com.moong.dto.response.pet;

import com.moong.domain.entity.Pet;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.YearMonth;

@Schema(description = "초대된 펫 정보")
public record InvitedPetResponse(
        @Schema(description = "반려동물 이름", example = "초코")
        String petName,

        @Schema(description = "반려동물 종류", example = "DAS")
        Breed breed,

        @Schema(description = "성별", example = "M")
        Gender gender,

        @Schema(implementation = String.class, example = "2026-02", pattern = "yyyy-MM")
        YearMonth birthDate
) {
    public static InvitedPetResponse noneInvited() {
        return new InvitedPetResponse(null, null, null, null);
    }

    public InvitedPetResponse(Pet pet) {
        this(
                pet.getName(),
                pet.getBreed(),
                pet.getGender(),
                YearMonth.of(pet.getBirthDate().getYear(), pet.getBirthDate().getMonthValue())
        );
    }
}
