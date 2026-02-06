package com.moong.domain.pet;

import java.time.LocalDate;
import java.time.Period;
import lombok.Getter;

@Getter
public class PetAge {

    private final int value;

    public PetAge(LocalDate birthDate) {
        LocalDate today = LocalDate.now();
        this.value = Period.between(birthDate, today).getYears();
    }

    public int plus(int value) {
        return this.value + value;
    }
}
