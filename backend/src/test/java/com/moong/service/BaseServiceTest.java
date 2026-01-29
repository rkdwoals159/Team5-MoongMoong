package com.moong.service;

import com.moong.DataBaseCleaner;
import com.moong.fixture.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.stream.IntStream;

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
  
    protected void runAtSameTime(int count, Runnable task) throws InterruptedException {
        List<Thread> threads = IntStream.range(0, count)
                .mapToObj(i -> new Thread(task))
                .toList();

        threads.forEach(Thread::start);
        for (Thread thread : threads) {
            thread.join();
        }
    }
}
