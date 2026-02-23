package com.moong.dto.response.medicaladvice;

import com.moong.domain.groupexpense.GroupExpense;
import com.moong.domain.petmedical.PetMedical;
import com.moong.domain.treatment.Treatment;
import com.moong.domain.enums.Disease;
import com.moong.domain.groupexpense.GroupExpenses;
import com.moong.domain.medicaladvice.TreatmentAvgCost;

import java.util.List;

public record AiMedicalAdviceRequest(
        Disease disease,
        int ratio,
        List<TreatmentAvgCost> treatmentAvgCosts,
        long avgMedicalExpense
) {

    public AiMedicalAdviceRequest(PetMedical petMedical,
                                  List<Treatment> treatments,
                                  List<GroupExpense> groupMedicalExpenses) {
        this(
                petMedical.getDisease(),
                petMedical.getRatio(),
                treatments.stream()
                        .map(treatment -> new TreatmentAvgCost(
                                treatment.getName(),
                                treatment.getAveragePrice()
                        ))
                        .toList(),
                new GroupExpenses(groupMedicalExpenses).averageMonthlyCost()
        );
    }
}
