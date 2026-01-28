package com.moong.service;

import com.moong.domain.entity.*;
import com.moong.domain.enums.Disease;
import com.moong.dto.response.groupmedical.GroupMedicalInfoResponse;
import com.moong.dto.response.groupmedical.TreatmentResponse;
import com.moong.dto.response.groupmedical.TreatmentsResponse;
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

    @DisplayName("특정 질병의 의료비 데이터를 조회할 수 있다")
    @Test
    void getTreatment() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved("서울시", "중구");
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        Treatment treatment = treatmentGenerator.generateSaved(Disease.DER, "피부염", "서울시", "중구");

        TreatmentsResponse response = groupMedicalService.getTreatment(member, Disease.DER);
        TreatmentResponse treatmentResponse = response.treatments().get(0);

        assertAll(
                () -> assertThat(treatmentResponse.name()).isEqualTo(treatment.getName()),
                () -> assertThat(treatmentResponse.description()).isEqualTo(treatment.getDescription()),
                () -> assertThat(treatmentResponse.minPrice()).isEqualTo(treatment.getMinPrice()),
                () -> assertThat(treatmentResponse.maxPrice()).isEqualTo(treatment.getMaxPrice()),
                () -> assertThat(treatmentResponse.averagePrice()).isEqualTo(treatment.getAveragePrice())
        );
    }

    @DisplayName("거주 지역에 특정 질병의 의료비 데이터가 존재하지 않을 경우 빈 배열을 반환한다")
    @Test
    void getTreatment_noTreatmentInRegion() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved("서울시", "중구");
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        treatmentGenerator.generateSaved(Disease.DER, "피부염", "서울시", "영등포구");

        TreatmentsResponse response = groupMedicalService.getTreatment(member, Disease.DER);

        assertThat(response.treatments()).isEmpty();
    }
}
