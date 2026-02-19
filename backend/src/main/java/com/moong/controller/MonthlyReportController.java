package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.MonthlyReportSwagger;
import com.moong.domain.entity.Member;
import com.moong.facade.report.MonthlyReportFacadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MonthlyReportController implements MonthlyReportSwagger {

    private final MonthlyReportFacadeService monthlyReportFacadeService;

    @Override
    @GetMapping("/report")
    public ResponseEntity<Void> sendThisMonthReport(@AuthMember Member member) {
        monthlyReportFacadeService.sendThisMonthReport(member);
        return ResponseEntity.ok().build();
    }
}
