package com.moong.scheduler.report;

import com.moong.annotation.lock.DistributedLock;
import com.moong.facade.report.MonthlyReportFacadeService;
import com.moong.service.report.MonthlyGroupExpenseService;
import com.moong.service.report.MonthlyMemberExpenseService;
import java.time.YearMonth;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MonthlyExpenseScheduler {

    private final MonthlyMemberExpenseService monthlyMemberExpenseService;
    private final MonthlyGroupExpenseService monthlyGroupExpenseService;
    private final MonthlyReportFacadeService monthlyReportFacadeService;

    @DistributedLock(
            key = "'scheduler:statistics'",
            waitTime = 0L, //대기시간 0초 -> 하나의 Master만 분산락 획득
            leaseTime = -1L, //락 유지시간 -1 > Redisson WatchDog 자동연장 활용
            timeUnit = TimeUnit.SECONDS
    )
    @Scheduled(cron = "0 0 6 1 * *")
    public void saveAllStatics() {
        YearMonth lastMonth = YearMonth.now().minusMonths(1L);
        monthlyMemberExpenseService.saveAllMonthlyMemberExpense(lastMonth);
        monthlyGroupExpenseService.saveAllMonthlyGroupExpenses(lastMonth);
        monthlyReportFacadeService.sendAllGroupMonthlyReport(YearMonth.now().minusMonths(1));
    }
}
