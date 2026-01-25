package com.moong.fixture;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.repository.MemberExpenseRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;

@Component
public class MemberExpenseGenerator {

    private final MemberExpenseRepository memberExpenseRepository;

    public MemberExpenseGenerator(MemberExpenseRepository memberExpenseRepository) {
        this.memberExpenseRepository = memberExpenseRepository;
    }

    public MemberExpense generateSaved(Member member, LocalDate spentAt, LocalDateTime modifiedDate) {
        MemberExpense memberExpense = new MemberExpense(
                null,
                spentAt,
                "감기약 및 처방약 구매",
                1000,
                "병원비",
                "약/처방",
                "내과 진료 후 약국",
                modifiedDate,
                member
        );
        return memberExpenseRepository.save(memberExpense);
    }
}
