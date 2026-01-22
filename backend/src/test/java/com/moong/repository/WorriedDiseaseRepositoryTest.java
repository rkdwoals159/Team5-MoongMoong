package com.moong.repository;

import com.moong.domain.entity.Pet;
import com.moong.domain.entity.WorriedDisease;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class WorriedDiseaseRepositoryTest extends BaseRepositoryTest{

    @Autowired
    private WorriedDiseaseRepository worriedDiseaseRepository;

    @DisplayName("걱정되는 질병을 모두 저장할 수 있다.")
    @Test
    void saveAll(){
        Pet pet = new Pet(1L, "코코", Breed.BEA, Gender.F, LocalDate.of(2025, 5, 29), "서울시", "중구");
        Pet pet1 = new Pet(2L, "뭉치", Breed.BEA, Gender.F, LocalDate.of(2025, 5, 29), "서울시", "중구");
        WorriedDisease worriedDisease = new WorriedDisease(null, Disease.CAR, pet);
        WorriedDisease worriedDisease1 = new WorriedDisease(null, Disease.DER, pet1);

        List<WorriedDisease> worriedDiseases = List.of(worriedDisease1, worriedDisease);
        worriedDiseaseRepository.saveAll(worriedDiseases);

        List<WorriedDisease> savedWorriedDiseases = worriedDiseaseRepository.findAll();
        assertThat(savedWorriedDiseases).hasSize(worriedDiseases.size());
    }
}
