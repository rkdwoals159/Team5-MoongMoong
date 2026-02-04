package com.moong.client.categorize;

import static org.junit.jupiter.api.Assertions.*;

import com.moong.ai.OpenAiModel;
import com.moong.dto.request.memberexpense.CategorizeRequest;
import java.util.UUID;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@Disabled
@ActiveProfiles("test")
@SpringBootTest
class OpenAiCategorizeClientTest {

    @Autowired
    private OpenAiCategorizeClient openAiCategorizeClient;

    @Test
    void test() {
        CategorizeRequest request = new CategorizeRequest(
                "허리수술",
                UUID.randomUUID().toString()
        );
        openAiCategorizeClient.categorize(request, OpenAiModel.GPT_4_1_MODEL.getModel());
    }
}
