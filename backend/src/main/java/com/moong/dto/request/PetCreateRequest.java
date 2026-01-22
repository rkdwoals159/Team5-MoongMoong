package com.moong.dto.request;

import com.moong.domain.entity.Pet;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
public class PetCreateRequest {

    private final String petName;
    private final Breed breed;
    private final Gender gender;
    private final LocalDate birthDate;
    private final String city;
    private final String district;
    private final List<Disease> diseases;

    public Pet toPet() {
        return new Pet(null, petName, breed, gender, birthDate, city, district);
    }

    public List<Disease> getDiseases() {
        return diseases;
    }
}
