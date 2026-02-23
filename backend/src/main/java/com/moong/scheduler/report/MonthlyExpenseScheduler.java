package com.moong.scheduler.report;

import com.moong.facade.report.MonthlyReportFacadeService;
import com.moong.service.report.MonthlyGroupExpenseService;
import com.moong.service.report.MonthlyMemberExpenseService;
import java.time.YearMonth;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MonthlyExpenseScheduler {

    private final MonthlyMemberExpenseService monthlyMemberExpenseService;
    private final MonthlyGroupExpenseService monthlyGroupExpenseService;
    private final MonthlyReportFacadeService monthlyReportFacadeService;

    @Scheduled(cron = "0 0 6 1 * *")
    public void saveAllStatics() {
        YearMonth lastMonth = YearMonth.now().minusMonths(1L);
        monthlyMemberExpenseService.saveAllMonthlyMemberExpense(lastMonth);
        monthlyGroupExpenseService.saveAllMonthlyGroupExpenses(lastMonth);
        monthlyReportFacadeService.sendAllGroupMonthlyReport(YearMonth.now().minusMonths(1));
    }
}
