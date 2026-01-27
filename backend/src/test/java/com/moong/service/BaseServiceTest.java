package com.moong.service;

import com.moong.DataBaseCleaner;
import com.moong.fixture.CrewGenerator;
import com.moong.fixture.GroupExpenseGenerator;
import com.moong.fixture.MemberGenerator;
import com.moong.fixture.PetGenerator;
import com.moong.fixture.PetGroupGenerator;
import com.moong.fixture.MemberExpenseGenerator;
import com.moong.fixture.WorriedDiseaseGenerator;
import com.moong.fixture.GroupMedicalAdviceGenerator;
import java.util.List;
import java.util.stream.IntStream;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

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
