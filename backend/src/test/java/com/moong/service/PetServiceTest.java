package com.moong.service;

import com.moong.domain.entity.Pet;
import com.moong.domain.entity.WorriedDisease;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.dto.request.PetCreateRequest;
import com.moong.dto.response.PetCreateResponse;
import com.moong.repository.PetRepository;
import com.moong.repository.WorriedDiseaseRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

class PetServiceTest extends BaseServiceTest {

    @Autowired
    private PetService petService;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private WorriedDiseaseRepository worriedDiseaseRepository;

    @Test
    void createPet() {
        List<Disease> diseases = List.of(Disease.CAR, Disease.DER);
        PetCreateRequest petCreateRequest = new PetCreateRequest(
                "코코",
                Breed.BEA,
                Gender.F,
                LocalDate.of(2025, 5, 29),
                "서울시",
                "중구",
                diseases
        );

        PetCreateResponse response = petService.createPet(petCreateRequest);

        Optional<Pet> savedPet = petRepository.findById(response.getPetId());
        List<WorriedDisease> savedWorriedDiseases = worriedDiseaseRepository.findAll();

        assertAll(
                () -> assertThat(savedPet).isPresent(),
                () -> assertThat(savedWorriedDiseases).hasSize(diseases.size())
        );
    }

}
