package com.moong.scheduler.medicaladvice;

import com.moong.service.medicaladvice.PetMedicalAdviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class MedicalAdviceUpdateScheduler {

    private final PetMedicalAdviceService petMedicalAdviceService;

    @Scheduled(
            cron = "0 0 7 ? * SUN#1", // 매달 첫째주 월요일 새벽 7시 갱신
            zone = "Asia/Seoul"
    )
    public void refreshMedicalAdvice() {
        petMedicalAdviceService.upsertAllMedicalAdvice(LocalDate.now());
    }
}
