package com.moong.dto.response.auth;

import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Gender;
import com.moong.dto.response.member.FacadeLoginResponse;
import java.time.YearMonth;

public record AuthLoginResponse(
        boolean isInvited,
        boolean isNew,
        long memberId,
        String name,
        String imageUrl,
        String petName,
        Breed breed,
        Gender gender,
        YearMonth birthDate
) {

    public AuthLoginResponse(FacadeLoginResponse loginResponse) {
        this(
                loginResponse.isInvited(),
                loginResponse.isNew(),
                loginResponse.memberId(),
                loginResponse.name(),
                loginResponse.imageUrl(),
                loginResponse.invitedPetResponse().petName(),
                loginResponse.invitedPetResponse().breed(),
                loginResponse.invitedPetResponse().gender(),
                loginResponse.invitedPetResponse().birthDate()
        );
    }
}
