package com.moong.dto.response.medicaladvice;

import com.moong.domain.groupexpense.GroupExpense;
import com.moong.domain.member.Member;
import com.moong.domain.memberexpense.MemberExpense;
import com.moong.domain.petgroup.PetGroup;
import com.moong.domain.petmedical.PetMedical;
import com.moong.domain.treatment.Treatment;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.MainCategoryType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AiMedicalAdviceRequestTest {

    @DisplayName("같은 달 지출은 합산되고 월평균 의료비가 정확히 계산된다")
    @Test
    void avgMedicalExpense_sumsSameMonth_andAveragesCorrectly() {
        // given
        PetMedical petMedical = mock(PetMedical.class);
        when(petMedical.getDisease()).thenReturn(Disease.values()[0]);
        when(petMedical.getRatio()).thenReturn(70);

        Member member = mock(Member.class);
        PetGroup petGroup = mock(PetGroup.class);

        MemberExpense jan1 = new MemberExpense(
                null, LocalDate.of(2026, 1, 10), "medical", 100L,
                MainCategoryType.MEDICAL_EXPENSES, null, null, null, member
        );

        MemberExpense jan2 = new MemberExpense(
                null, LocalDate.of(2026, 1, 20), "medical", 200L,
                MainCategoryType.MEDICAL_EXPENSES, null, null, null, member
        );

        MemberExpense feb = new MemberExpense(
                null, LocalDate.of(2026, 2, 5), "medical", 100L,
                MainCategoryType.MEDICAL_EXPENSES, null, null, null, member
        );

        MemberExpense mar = new MemberExpense(
                null, LocalDate.of(2026, 3, 1), "medical", 600L,
                MainCategoryType.MEDICAL_EXPENSES, null, null, null, member
        );

        List<GroupExpense> groupExpenses = List.of(
                new GroupExpense(jan1, petGroup),
                new GroupExpense(jan2, petGroup),
                new GroupExpense(feb, petGroup),
                new GroupExpense(mar, petGroup)
        );

        // when
        AiMedicalAdviceRequest res =
                new AiMedicalAdviceRequest(petMedical, List.<Treatment>of(), groupExpenses);

        // then
        assertAll(
                () -> assertThat(res.avgMedicalExpense()).isEqualTo(333L)
        );
    }

    @DisplayName("지출이 비어 있으면 평균 의료비는 0이다")
    @Test
    void avgMedicalExpense_empty_returnsZero() {
        // given
        PetMedical petMedical = mock(PetMedical.class);
        when(petMedical.getDisease()).thenReturn(Disease.values()[0]);
        when(petMedical.getRatio()).thenReturn(10);

        // when
        AiMedicalAdviceRequest res =
                new AiMedicalAdviceRequest(petMedical, List.<Treatment>of(), List.of());

        // then
        assertAll(
                () -> assertThat(res.avgMedicalExpense()).isEqualTo(0L)
        );
    }
}
