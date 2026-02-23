package com.moong.controller.petmedical;

import com.moong.service.petmedical.PetMedicalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PetMedicalController {

    private final PetMedicalService petMedicalService;

    @GetMapping("/pet-medical-ai")
    public ResponseEntity<Void> refresh() {
        petMedicalService.syncFromAiServerOptimized();
        return ResponseEntity.ok().build();
    }
}
