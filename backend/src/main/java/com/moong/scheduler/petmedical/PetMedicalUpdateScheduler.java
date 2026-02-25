package com.moong.scheduler.petmedical;

import com.moong.annotation.lock.DistributedLock;
import com.moong.service.petmedical.PetMedicalService;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PetMedicalUpdateScheduler {

    private final PetMedicalService petMedicalService;

    @DistributedLock(
            key = "'scheduler:petmedical:refresh'",
            waitTime = 0L, //대기시간 1초 -> 하나의 인스턴스만 분산락 획득
            leaseTime = -1L, //락 유지시간 -1 > Redisson WatchDog 자동연장 활용
            timeUnit = TimeUnit.SECONDS
    )
    @Scheduled(
            cron = "0 0 5 ? * SUN", //일요일 새벽 5시 갱신
            zone = "Asia/Seoul"
    )
    public void refreshPetMedical() {
        petMedicalService.syncFromAiServerOptimized();
    }
}
