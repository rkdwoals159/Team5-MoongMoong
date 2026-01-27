package com.moong.service;

import com.moong.domain.entity.GroupMedicalAdvice;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.response.GroupMedicalInfoResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

class GroupMedicalServiceTest extends BaseServiceTest {

    @Autowired
    private GroupMedicalService groupMedicalService;

    @DisplayName("그룹 의사 권장사항을 조회할 수 있다")
    @Test
    void getGroupMedicalInfo() {

        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        GroupMedicalAdvice groupMedicalAdvice = groupMedicalAdviceGenerator.generateSaved(petGroup);

        GroupMedicalInfoResponse response = groupMedicalService.getGroupMedicalInfo(member);

        assertAll(
                () -> assertThat(response.advice()).isEqualTo(groupMedicalAdvice.getAdvice()),
                () -> assertThat(response.expectedCost()).isEqualTo(groupMedicalAdvice.getExpectedCost()),
                () -> assertThat(response.year()).isEqualTo(groupMedicalAdvice.getYear())
        );

    }
}
