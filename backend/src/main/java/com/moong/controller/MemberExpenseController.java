package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.domain.entity.Member;
import com.moong.dto.request.memberexpense.CategorizeRequest;
import com.moong.dto.request.memberexpense.MemberExpensesUpsertRequest;
import com.moong.dto.response.categorize.CategorizeResponse;
import com.moong.dto.response.memberexpense.LastMonthComparisonResponse;
import com.moong.dto.response.memberexpense.MemberExpensesPeriodResponse;
import com.moong.controller.swagger.MemberExpenseControllerSwagger;
import com.moong.service.MemberExpenseService;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class MemberExpenseController implements MemberExpenseControllerSwagger {

    private final MemberExpenseService memberExpenseService;

    @Override
    @GetMapping
    public ResponseEntity<MemberExpensesPeriodResponse> getMemberExpensesByPeriod(
            @AuthMember Member member,
            @RequestParam(value = "startDate") LocalDate startDate,
            @RequestParam(value = "endDate") LocalDate endDate
    ) {
        MemberExpensesPeriodResponse response = memberExpenseService
                .getMemberExpensesByPeriod(member, startDate, endDate);

        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/compare/last-month")
    public ResponseEntity<LastMonthComparisonResponse> compareLastMonthExpense(
            @AuthMember Member member
    ) {
        LastMonthComparisonResponse response = memberExpenseService
                .compareLastMonthExpense(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @PatchMapping
    public ResponseEntity<Void> upsertMemberExpenses(
            @AuthMember Member member,
            @RequestBody MemberExpensesUpsertRequest request
    ) {
        memberExpenseService.upsertMemberExpenses(
                member,
                request
        );
        return ResponseEntity.noContent().build();
    }

    @Override
    @PostMapping
    public ResponseEntity<CategorizeResponse> categorizeMemberExpenses(
            @AuthMember Member member,
            @RequestBody CategorizeRequest request
    ) {
        CategorizeResponse response = memberExpenseService.categorize(request);
        return ResponseEntity.ok(response);
    }
}
