package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.GroupExpenseControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.dto.response.groupexpense.GroupExpensesDailyResponse;
import com.moong.dto.response.groupexpense.GroupExpensesResponse;
import com.moong.dto.response.groupexpense.CategoryAnalysisResponse;
import com.moong.dto.response.groupexpense.MedicalCategoryAnalysisResponse;
import com.moong.service.GroupExpenseService;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class GroupExpenseController implements GroupExpenseControllerSwagger {

    private final GroupExpenseService groupExpenseService;

    @Override
    @GetMapping(value = "/api/expenses/group")
    public ResponseEntity<GroupExpensesResponse> findGroupExpenses(
            @AuthMember Member member,
            @RequestParam(value = "startDate") LocalDate startDate,
            @RequestParam(value = "endDate") LocalDate endDate
    ) {
        GroupExpensesResponse response = groupExpenseService.findGroupExpensesByPeriod(member, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/api/expenses/group/analysis/category")
    public ResponseEntity<CategoryAnalysisResponse> findCategoryAnalysis(
            @AuthMember Member member,
            @RequestParam(value = "startDate") LocalDate startDate,
            @RequestParam(value = "endDate") LocalDate endDate
    ) {
        CategoryAnalysisResponse categoryAnalysis = groupExpenseService.findCategoryAnalysisByPeriod(
                member,
                startDate,
                endDate
        );
        return ResponseEntity.ok(categoryAnalysis);
    }

    @Override
    @GetMapping("/api/expenses/group/analysis/medical")
    public ResponseEntity<MedicalCategoryAnalysisResponse> findMedicalCategoryAnalysis(
            @AuthMember Member member,
            @RequestParam(value = "startDate") LocalDate startDate,
            @RequestParam(value = "endDate") LocalDate endDate
    ) {
        MedicalCategoryAnalysisResponse response = groupExpenseService.findMedicalCategoryAnalysisByPeriod(
                member,
                startDate,
                endDate
        );
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping(value = "/api/expenses/group/date")
    public ResponseEntity<GroupExpensesDailyResponse> findGroupDailyExpenses(
            @AuthMember Member member,
            @RequestParam(value = "spentAt") LocalDate spentAt
    ) {
        GroupExpensesDailyResponse response = groupExpenseService.findBySpentAt(
                member,
                spentAt
        );
        return ResponseEntity.ok(response);
    }
}
