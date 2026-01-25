package com.moong.controller;

import com.moong.dto.response.MemberExpensePeriodResponse;
import com.moong.controller.swagger.MemberExpenseControllerSwagger;
import com.moong.service.MemberExpenseService;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class MemberExpenseController implements MemberExpenseControllerSwagger {

    private final MemberExpenseService memberExpenseService;

    @Override
    @GetMapping("")
    public ResponseEntity<MemberExpensePeriodResponse> getMemberExpensesByPeriod(
            @RequestParam(value = "memberId") long memberId,
            @RequestParam(value = "startDate") LocalDate startDate,
            @RequestParam(value = "endDate") LocalDate endDate
    ) {
        MemberExpensePeriodResponse response = memberExpenseService
                .getMemberExpensesByPeriod(memberId, startDate, endDate);

        return ResponseEntity.ok(response);
    }
}
