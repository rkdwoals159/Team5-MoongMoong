package com.moong.domain.pet;

import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import lombok.Getter;

@Getter
public class PetAge {

    private static final int MAX_ALLOWED_PET_AGE = 20;

    private final int age;

    public PetAge(LocalDate birthDate) {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));
        this.age = Period.between(birthDate, today).getYears();
        validatePetAgeWithinAllowedRange();
    }

    private void validatePetAgeWithinAllowedRange() {
        if (age > MAX_ALLOWED_PET_AGE) {
            throw new BusinessException(ErrorCode.INVALID_PET_BIRTH_DATA);
        }
    }
}
