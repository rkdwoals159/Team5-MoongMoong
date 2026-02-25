package com.moong.service;

import static org.mockito.ArgumentMatchers.anyString;

import static org.mockito.ArgumentMatchers.any;

import com.moong.DataBaseCleaner;
import com.moong.client.oauth.OAuthClient;
import com.moong.domain.member.MemberInfo;
import com.moong.fixture.BankGenerator;
import com.moong.fixture.CoinGenerator;
import com.moong.fixture.CrewGenerator;
import com.moong.fixture.GroupExpenseGenerator;
import com.moong.fixture.GroupMedicalAdviceGenerator;
import com.moong.fixture.MemberExpenseGenerator;
import com.moong.fixture.MemberGenerator;
import com.moong.fixture.PetGenerator;
import com.moong.fixture.PetGroupGenerator;
import com.moong.fixture.PetMedicalGenerator;
import com.moong.fixture.TreatmentGenerator;
import com.moong.fixture.WorriedDiseaseGenerator;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.IntStream;
import org.junit.jupiter.api.BeforeEach;
import com.moong.dto.response.payment.TossConfirmResponse;
import com.moong.client.payment.TossPaymentClient;
import com.moong.dto.request.payment.CoinPaymentConfirmRequest;
import com.moong.fixture.*;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import org.springframework.test.context.bean.override.mockito.MockitoBean;

@ActiveProfiles("test")
@ExtendWith(DataBaseCleaner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public abstract class BaseServiceTest {

    @Autowired
    protected PetGenerator petGenerator;

    @Autowired
    protected WorriedDiseaseGenerator worriedDiseaseGenerator;

    @Autowired
    protected MemberGenerator memberGenerator;

    @Autowired
    protected PetGroupGenerator petGroupGenerator;

    @Autowired
    protected CrewGenerator crewGenerator;

    @Autowired
    protected GroupExpenseGenerator groupExpenseGenerator;

    @Autowired
    protected MemberExpenseGenerator memberExpenseGenerator;

    @Autowired
    protected GroupMedicalAdviceGenerator groupMedicalAdviceGenerator;

    @Autowired
    protected PetMedicalGenerator petMedicalGenerator;

    @Autowired
    protected TreatmentGenerator treatmentGenerator;

    @Autowired
    protected BankGenerator bankGenerator;

    @Autowired
    protected CoinGenerator coinGenerator;

    @Autowired
    protected MonthlyMemberExpenseGenerator monthlyMemberExpenseGenerator;

    @Autowired
    protected MonthlyGroupExpenseGenerator monthlyGroupExpenseGenerator;

    @Autowired
    protected CoinPaymentGenerator coinPaymentGenerator;

    @Autowired
    protected NotificationCursorGenerator notificationCursorGenerator;

    @Autowired
    protected NotificationGenerator notificationGenerator;

    @Autowired
    protected CrewNotificationGenerator crewNotificationGenerator;

    @MockitoBean
    protected OAuthClient oAuthClient;

    @MockitoBean
    protected TossPaymentClient tossPaymentClient;

    @MockitoBean
    private RedissonClient redissonClient;

    protected void runAtSameTime(int count, Runnable task) throws InterruptedException {
        List<Thread> threads = IntStream.range(0, count)
                .mapToObj(i -> new Thread(task))
                .toList();

        threads.forEach(Thread::start);
        for (Thread thread : threads) {
            thread.join();
        }
    }

    @BeforeEach
    public void beforeEach() {
        int randNum = new SecureRandom().nextInt(1000);
        Mockito.when(oAuthClient.requestMemberInfo(anyString()))
                .thenReturn(new MemberInfo("email" + randNum + "@email.com"));

        TossConfirmResponse confirmResponse = new TossConfirmResponse(
                "testpaymentKey", UUID.randomUUID(), "DONE", 100L
        );
        Mockito.when(tossPaymentClient.confirm(any(CoinPaymentConfirmRequest.class)))
                .thenReturn(CompletableFuture.completedFuture(confirmResponse));
    }
}
