package com.moong.service;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;

class GroupMedicalAdviceServiceTest extends BaseServiceTest {

    @Autowired
    private GroupMedicalAdviceService groupMedicalAdviceService;

    @DisplayName("그룹 첫 생성 시 AI 의사 권장사항이 생성된다.")
    @Test
    void createGroupMedicalAdvice_success() {
        Member member = memberGenerator.generateSaved("member");
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        crewGenerator.generateSaved(petGroup, member);
        petMedicalGenerator.generateSaved(Breed.BEA, 1, Gender.F, Disease.URI, 32);
        treatmentGenerator.generatedSaved(Disease.URI, "방광결석제거 수술", 460000, 575000, 690000);
        treatmentGenerator.generatedSaved(Disease.URI, "신장제거 수술", 1000000, 1250000, 1500000);
        treatmentGenerator.generatedSaved(Disease.URI, "신장기능 검사(SDMA)", 70000, 70000, 70000);
        treatmentGenerator.generatedSaved(Disease.URI, "요검사", 22000, 23500, 25000);

        groupMedicalAdviceService.createMedicalAdvice(member.getId(), petGroup.getId(), LocalDate.now());
    }
}
