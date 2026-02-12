package com.moong.fixture;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.repository.memberexpense.MemberExpenseRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class MemberExpenseGenerator {

    private final MemberExpenseRepository memberExpenseRepository;

    public MemberExpenseGenerator(MemberExpenseRepository memberExpenseRepository) {
        this.memberExpenseRepository = memberExpenseRepository;
    }

    public MemberExpense generateSaved(
            LocalDate spentAt,
            String usage,
            long cost,
            String mainCategory,
            String subCategory,
            String memo,
            LocalDateTime modifiedDate,
            Member member
    ) {
        MemberExpense memberExpense = generateUnsaved(
                null,
                spentAt,
                usage,
                cost,
                mainCategory,
                subCategory,
                memo,
                modifiedDate,
                member
        );
        return memberExpenseRepository.save(memberExpense);
    }

    public MemberExpense generateUnsaved(
            Long id,
            LocalDate spentAt,
            String usage,
            long cost,
            String mainCategory,
            String subCategory,
            String memo,
            LocalDateTime modifiedDate,
            Member member
    ) {
        return new MemberExpense(
                id,
                spentAt,
                usage,
                cost,
                mainCategory,
                subCategory,
                memo,
                modifiedDate,
                member
        );
    }

    public List<MemberExpense> generatedListSaved(Member member) {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        MemberExpense memberExpense1 = generateSaved(
                yesterday,
                "감기약 및 처방약 구매",
                1000,
                "병원비",
                "약/처방",
                "내과 진료 후 약국",
                yesterday.atTime(10, 0),
                member
        );
        MemberExpense memberExpense2 = generateSaved(
                yesterday,
                "러닝화 구매",
                129000,
                "의류",
                null,
                null,
                yesterday.atTime(12, 0),
                member
        );
        MemberExpense memberExpense3 = generateSaved(
                today,
                "영화 관람",
                15000,
                "여가",
                "취미",
                "주말 혼영",
                yesterday.atTime(9, 0),
                member
        );

        return List.of(memberExpense1, memberExpense2, memberExpense3);
    }
}
