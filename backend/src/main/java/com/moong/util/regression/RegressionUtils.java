package com.moong.util.regression;

import com.moong.dto.response.regression.RegressionResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.math3.distribution.TDistribution;
import org.apache.commons.math3.stat.regression.SimpleRegression;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RegressionUtils {

    public static RegressionResponse predict(List<Long> amounts) {
        SimpleRegression regression = new SimpleRegression();
        AtomicInteger count = new AtomicInteger();
        for (Long value : amounts) {
            regression.addData(count.getAndIncrement(), value);
        }
        long prediction = Math.round(regression.getSlope() * count.get() + regression.getIntercept());
        long margin = getMargin(amounts.size(), regression);
        return new RegressionResponse(
                regression.getSlope(),
                regression.getIntercept(),
                regression.getR(),
                margin,
                prediction,
                Math.max(prediction - margin, 0),
                prediction + margin
        );
    }

    private static long getMargin(int n, SimpleRegression regression) {
        if (n <= 2) {
            throw new BusinessException(ErrorCode.REGRESSION_DATA_SHORTAGE_ERROR);
        }

        double rmse = Math.sqrt(regression.getMeanSquareError());
        TDistribution tDist = new TDistribution(n - 2);
        double tValue = tDist.inverseCumulativeProbability(0.975);
        return Math.round(tValue * rmse);
    }
}
