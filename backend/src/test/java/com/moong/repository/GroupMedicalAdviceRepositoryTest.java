package com.moong.repository;

import com.moong.domain.entity.GroupMedicalAdvice;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

class GroupMedicalAdviceRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private GroupMedicalAdviceRepository groupMedicalAdviceRepository;

    @DisplayName(value = "그룹의 의사 권장사항을 가져온다.")
    @Test
    void findByGroupId() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        GroupMedicalAdvice groupMedicalAdvice = groupMedicalAdviceGenerator.generateSaved(petGroup);

        GroupMedicalAdvice actual = groupMedicalAdviceRepository.getByPetGroup_Id(petGroup.getId());
        assertAll(
                () -> assertThat(actual.getAdvice())
                        .isEqualTo(groupMedicalAdvice.getAdvice()),
                () -> assertThat(actual.getExpectedCost())
                        .isEqualTo(groupMedicalAdvice.getExpectedCost()),
                () -> assertThat(actual.getYear())
                        .isEqualTo(groupMedicalAdvice.getYear()),
                () -> assertThat(actual.getPetGroup())
                        .isEqualTo(groupMedicalAdvice.getPetGroup())
        );
    }

    @DisplayName(value = "그룹의 의사 권장사항이 존재하지 않을 때 에러를 반환한다.")
    @Test
    void getByGroupId() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);

        assertThatThrownBy(() -> groupMedicalAdviceRepository.getByPetGroup_Id(petGroup.getId()))
                .isInstanceOf(BusinessException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.MEDICAL_ADVICE_NOT_FOUND);
    }
}
