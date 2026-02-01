package com.moong.domain.memberexpense;

import lombok.Getter;

@Getter
public class MonthlyExpenseStats {

    private final long previousTotal;
    private final long previousMedicalTotal;
    private final long currentTotal;
    private final long currentMedicalTotal;

    public MonthlyExpenseStats(long previousTotal, long lastMedicalTotal, long currentTotal, long currentMedicalTotal) {
        this.previousTotal = previousTotal;
        this.previousMedicalTotal = lastMedicalTotal;
        this.currentTotal = currentTotal;
        this.currentMedicalTotal = currentMedicalTotal;
    }

    public Integer getTotalRatio() {
        return calculateRate(previousTotal, currentTotal);
    }

    public Integer getMedicalRatio() {
        return calculateRate(previousMedicalTotal, currentMedicalTotal);
    }

    private Integer calculateRate(long previous, long current) {
        if (previous == 0) {
            return null;
        }
        return (int) Math.round((current - previous) * 100.0 / previous);
    }
}
