package com.moong.domain.report;

import com.moong.dto.response.regression.RegressionResponse;
import com.moong.util.regression.RegressionUtils;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class MonthlyExpenseRegressionAnalyzer {

    public RegressionResponse predictByCostHistory(List<Long> costHistory) {
        if (costHistory.size() <= 2) {
            return RegressionResponse.defaultResponse(costHistory);
        }
        return RegressionUtils.predict(costHistory);
    }

    public RegressionResponse predict(List<? extends MonthlyExpense> expenses) {
        List<Long> amounts = getExpenseAmounts(expenses);
        return predictByCostHistory(amounts);
    }

    private List<Long> getExpenseAmounts(List<? extends MonthlyExpense> expenses) {
        return expenses.stream()
                .map(MonthlyExpense::getTotalAmount)
                .toList();
    }
}
