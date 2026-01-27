package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.GroupExpenseControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.dto.response.groupexpense.GroupExpensesResponse;
import com.moong.dto.response.groupexpense.CategoryAnalysisResponse;
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
    @GetMapping("/api/expenses/group")
    public ResponseEntity<GroupExpensesResponse> findGroupExpenses(
            @AuthMember Member member,
            @RequestParam(value = "startDate") LocalDate startDate,
            @RequestParam(value = "endDate") LocalDate endDate
    ) {
        GroupExpensesResponse response = groupExpenseService.findByPeriod(member, startDate, endDate);
        return ResponseEntity.ok(response);
    }
  
    @Override
    @GetMapping("/api/expenses/group/analysis/category")
    public ResponseEntity<CategoryAnalysisResponse> findCategoryAnalysis(
            @AuthMember Member member,
            @RequestParam(value = "startDate") LocalDate startDate,
            @RequestParam(value = "endDate") LocalDate endDate
    ) {
        CategoryAnalysisResponse categoryAnalysis = groupExpenseService.findCategoryAnalysis(
                member,
                startDate,
                endDate
        );
        return ResponseEntity.ok(categoryAnalysis);
    }
}
