package com.moong.controller.member;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.MemberExpenseControllerSwagger;
import com.moong.domain.member.Member;
import com.moong.dto.command.MemberExpenseReadCommand;
import com.moong.dto.request.memberexpense.CategorizeRequest;
import com.moong.dto.request.memberexpense.MemberExpensesUpsertRequest;
import com.moong.dto.response.categorize.CategorizeResponse;
import com.moong.dto.response.memberexpense.LastMonthComparisonResponse;
import com.moong.dto.response.memberexpense.MemberExpensesPeriodResponse;
import com.moong.dto.response.memberexpense.MemberExpensesPeriodResponseV2;
import com.moong.service.memberexpense.MemberExpenseService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MemberExpenseController implements MemberExpenseControllerSwagger {

    private final MemberExpenseService memberExpenseService;

    @Override
    @GetMapping("/api/expenses")
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
    @GetMapping("/api/v2/expenses")
    public ResponseEntity<MemberExpensesPeriodResponseV2> getMemberExpensesByPeriodV2(
            @AuthMember Member member,
            @RequestParam(value = "startDate") LocalDate startDate,
            @RequestParam(value = "endDate") LocalDate endDate,
            @RequestParam(value = "mainCategory", required = false) String mainCategory,
            @RequestParam(value = "lastRowId", required = false) Long lastRowId,
            Pageable pageable
    ) {
        MemberExpenseReadCommand command = new MemberExpenseReadCommand(
                member,
                startDate,
                endDate,
                lastRowId,
                mainCategory,
                pageable
        );
        MemberExpensesPeriodResponseV2 response = memberExpenseService.getMemberExpensesByPeriodV2(command);
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/api/expenses/compare/last-month")
    public ResponseEntity<LastMonthComparisonResponse> compareLastMonthExpense(
            @AuthMember Member member
    ) {
        LastMonthComparisonResponse response = memberExpenseService
                .compareLastMonthExpense(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @PatchMapping("/api/expenses")
    public ResponseEntity<Void> upsertMemberExpenses(
            @AuthMember Member member,
            @RequestBody @Valid MemberExpensesUpsertRequest request
    ) {
        memberExpenseService.upsertMemberExpenses(
                member,
                request
        );
        return ResponseEntity.noContent().build();
    }

    @Override
    @PostMapping("/api/expenses")
    public ResponseEntity<CategorizeResponse> categorizeMemberExpenses(
            @AuthMember Member member,
            @RequestBody @Valid CategorizeRequest request
    ) {
        CategorizeResponse response = memberExpenseService.categorize(request);
        return ResponseEntity.ok(response);
    }
}
