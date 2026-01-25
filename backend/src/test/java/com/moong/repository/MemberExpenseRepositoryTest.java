package com.moong.repository;


import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;

class MemberExpenseRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private MemberExpenseRepository memberExpenseRepository;

    @DisplayName("멤버의 소비내역을 기간 기준으로 조회")
    @Test
    void findByMemberIdAndPeriod_filtersOnly() {
        Member member = memberGenerator.generateSaved("멤버1");

        MemberExpense me1 = memberExpenseGenerator.generateSaved(
                member,
                LocalDate.of(2026, 1, 1),
                LocalDateTime.of(2026, 1, 1, 10, 0)
        );
        MemberExpense me2 = memberExpenseGenerator.generateSaved(
                member,
                LocalDate.of(2026, 1, 2),
                LocalDateTime.of(2026, 1, 2, 12, 0)
        );
        MemberExpense me3 = memberExpenseGenerator.generateSaved(
                member,
                LocalDate.of(2026, 1, 3),
                LocalDateTime.of(2026, 1, 3, 9, 0)
        );

        LocalDate startDate = LocalDate.of(2026, 1, 1);
        LocalDate endDate = LocalDate.of(2026, 1, 2);

        List<MemberExpense> result = memberExpenseRepository.findByMemberIdAndPeriod(
                member.getId(),
                startDate,
                endDate,
                Sort.unsorted()
        );

        assertThat(result)
                .contains(me1, me2)
                .doesNotContain(me3);
    }

}
