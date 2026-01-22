package com.moong.dto.response;

import com.moong.domain.entity.Pet;
import com.moong.domain.entity.WorriedDisease;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@RequiredArgsConstructor
public class PetCreateResponse {

    private final long petId;
    private final String petName;
    private final Breed breed;
    private final Gender gender;
    private final LocalDate birthDate;
    private final String city;
    private final String district;
    private final List<Disease> diseases;

    public PetCreateResponse(Pet pet, List<WorriedDisease> worriedDiseases) {
        petId = pet.getId();
        petName = pet.getName();
        breed = pet.getBreed();
        gender = pet.getGender();
        birthDate = pet.getBirthDate();
        city = pet.getCity();
        district = pet.getDistrict();
        diseases = worriedDiseases.stream()
                .map(WorriedDisease::getDisease)
                .toList();
    }
}
