package com.moong.scheduler.medicaladvice;

import com.moong.annotation.lock.DistributedLock;
import com.moong.service.medicaladvice.PetMedicalAdviceService;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class MedicalAdviceUpdateScheduler {

    private final PetMedicalAdviceService petMedicalAdviceService;

    @DistributedLock(
            key = "'scheduler:medicaladvice:refresh'",
            waitTime = 0L, //대기시간 0초 -> 하나의 인스턴스만 분산락 획득
            leaseTime = -1L, //락 유지시간 -1 > Redisson WatchDog 자동연장 활용
            timeUnit = TimeUnit.SECONDS
    )
    @Scheduled(
            cron = "0 0 7 ? * SUN#1", // 매달 첫째주 월요일 새벽 7시 갱신
            zone = "Asia/Seoul"
    )
    public void refreshMedicalAdvice() {
        petMedicalAdviceService.upsertAllMedicalAdvice(LocalDate.now());
    }
}
