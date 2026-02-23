package com.moong.util;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.dto.response.regression.RegressionResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.util.regression.RegressionUtils;
import java.util.List;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class RegressionUtilsTest {

    @DisplayName("선형 회귀 모델을 구현할 수 있다")
    @Test
    void predictSuccess() {
        List<Long> values = List.of(3L, 7L, 11L);

        RegressionResponse response = RegressionUtils.predict(values);

        assertAll(
                () -> assertThat(response.slope()).isEqualTo(4),
                () -> assertThat(response.intercept()).isEqualTo(3),
                () -> assertThat(response.prediction()).isEqualTo(15)
        );
    }

    @DisplayName("선형 회귀 모델 학습 데이터가 2개 이하일 경우 에러를 반환한다")
    @Test
    void predictFail() {
        List<Long> values = List.of(3L, 7L);

        Assertions.assertThatThrownBy(() -> RegressionUtils.predict(values))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.REGRESSION_DATA_SHORTAGE_ERROR.getMessage());
    }
}
