package com.moong.scheduler.petmedical;

import com.moong.service.PetMedicalService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PetMedicalUpdateScheduler {

    private final PetMedicalService petMedicalService;

    @Scheduled(
            cron = "0 0 5 ? * MON", //월요일 새벽 5시 갱신
            zone = "Asia/Seoul"
    )
    public void refreshPetMedical() {
        petMedicalService.syncFromAiServerOptimized();
    }
}
