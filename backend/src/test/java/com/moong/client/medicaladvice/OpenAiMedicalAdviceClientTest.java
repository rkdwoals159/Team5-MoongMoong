package com.moong.client.medicaladvice;

import com.moong.ai.OpenAiModel;
import com.moong.ai.OpenAiResult;
import com.moong.domain.enums.Disease;
import com.moong.domain.medicaladvice.TreatmentAvgCost;
import com.moong.dto.response.medicaladvice.AiMedicalAdviceRequest;
import com.moong.dto.response.medicaladvice.AiMedicalAdviceResponse;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;

@Disabled
@ActiveProfiles("test")
@SpringBootTest
class OpenAiMedicalAdviceClientTest {

    @Autowired
    private OpenAiMedicalAdviceClient openAiMedicalAdviceClient;

    @Test
    void test() {
        List<TreatmentAvgCost> treatmentAvgCostList = new ArrayList<>();
        treatmentAvgCostList.add(new TreatmentAvgCost("각막궤양 수술_한쪽", 1850000));
        treatmentAvgCostList.add(new TreatmentAvgCost("체리아이 수술_편측", 190000));
        treatmentAvgCostList.add(new TreatmentAvgCost("유루증 수술_한쪽", 350000));
        treatmentAvgCostList.add(new TreatmentAvgCost("안과_각막형광염색검사", 16500));
        treatmentAvgCostList.add(new TreatmentAvgCost("안과_안압검사(IOP)", 18500));
        treatmentAvgCostList.add(new TreatmentAvgCost("안과_종합검사", 220000));
        treatmentAvgCostList.add(new TreatmentAvgCost("진료비_안과", 15000));

        AiMedicalAdviceRequest input = new AiMedicalAdviceRequest(
                Disease.OCU,
                20,
                treatmentAvgCostList,
                30000L
        );

        OpenAiResult<AiMedicalAdviceResponse> res =
                openAiMedicalAdviceClient
                        .getMedicalAdvice(input, OpenAiModel.GPT_4_1_MINI_MODEL)
                        .join();
    }
}
