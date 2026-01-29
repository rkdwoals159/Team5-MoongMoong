package com.moong.domain.groupmedical;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.enums.Disease;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class DiseaseStatisticsTest {

    @DisplayName("질병에 해당하는 비율을 연도별로 반환한다")
    @Test
    void findDiseaseRatioHistory() {
        DiseaseRatio ocuRatio = new DiseaseRatio(2026, Disease.OCU, 3);
        DiseaseRatio carRatio1 = new DiseaseRatio(2026, Disease.CAR, 3);
        DiseaseRatio carRatio2 = new DiseaseRatio(2027, Disease.CAR, 5);
        DiseaseRatio carRatio3 = new DiseaseRatio(2028, Disease.CAR, 7);
        DiseaseStatistics statistics = new DiseaseStatistics(List.of(carRatio1, carRatio2, carRatio3, ocuRatio));

        List<Integer> actual = statistics.findDiseaseRatioHistory(Disease.CAR);

        assertThat(actual).containsExactly(carRatio1.getRatio(), carRatio2.getRatio(), carRatio3.getRatio());
    }
}
