package com.moong.service;

import com.moong.client.petmedical.AiPetMedicalClient;
import com.moong.domain.entity.PetMedical;
import com.moong.repository.petmedical.PetMedicalRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PetMedicalService {

    private static final int PET_MEDICAL_BATCH_SIZE = 50;

    private final PetMedicalRepository petMedicalRepository;
    private final AiPetMedicalClient aiPetMedicalClient;

    public void syncFromAiServerOptimized() {
        aiPetMedicalClient.getPetMedicalsStream()
                .buffer(PET_MEDICAL_BATCH_SIZE)
                .doOnNext(batch -> {
                    List<PetMedical> petMedicals = batch.stream()
                            .flatMap(b -> b.toPetMedical().stream())
                            .toList();
                    petMedicalRepository.saveAllByBulkQuery(petMedicals);
                })
                .blockLast();
    }
}
