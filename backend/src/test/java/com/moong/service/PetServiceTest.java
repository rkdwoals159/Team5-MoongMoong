package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.entity.WorriedDisease;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.dto.request.PetCreateRequest;
import com.moong.dto.response.pet.PetCreateResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.PetRepository;
import com.moong.repository.WorriedDiseaseRepository;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class PetServiceTest extends BaseServiceTest {

    @Autowired
    private PetService petService;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private WorriedDiseaseRepository worriedDiseaseRepository;

    @DisplayName("펫을 생성할 수 있다")
    @Test
    void createPet() {
        Member member = memberGenerator.generateSaved("softeer");
        List<Disease> diseases = List.of(Disease.CAR, Disease.DER);
        PetCreateRequest petCreateRequest = new PetCreateRequest(
                "코코",
                Breed.BEA,
                Gender.F,
                YearMonth.of(2025, 5),
                "서울시",
                "중구",
                diseases
        );

        PetCreateResponse response = petService.createPet(member, petCreateRequest);
        Optional<Pet> savedPet = petRepository.findById(response.petId());
        List<WorriedDisease> savedWorriedDiseases = worriedDiseaseRepository.findAll();

        assertAll(
                () -> assertThat(savedPet).isPresent(),
                () -> assertThat(savedWorriedDiseases).hasSize(diseases.size())
        );
    }

    @DisplayName("이미 회원의 펫이 있는 경우 중복해서 펫을 생성할 수 없다")
    @Test
    void createPetFailWhenAlreadyHasPet() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        List<Disease> diseases = List.of(Disease.CAR, Disease.DER);
        PetCreateRequest petCreateRequest = new PetCreateRequest(
                "코코",
                Breed.BEA,
                Gender.F,
                YearMonth.of(2025, 5),
                "서울시",
                "중구",
                diseases
        );

        assertThatThrownBy(() -> petService.createPet(member, petCreateRequest))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.ALREADY_EXISTS_PET.getMessage());
    }

}
