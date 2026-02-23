package com.moong.controller.petgroup;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.PetGroupMedicalControllerSwagger;
import com.moong.domain.member.Member;
import com.moong.domain.enums.Disease;
import com.moong.dto.response.petmedical.PetMedicalInfoResponse;
import com.moong.dto.response.petmedical.PetMedicalStatisticsResponse;
import com.moong.dto.response.treatment.TreatmentsResponse;
import com.moong.dto.response.petmedical.PetDiseaseRankingResponse;
import com.moong.service.petmedical.PetMedicalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/group/medical")
@RequiredArgsConstructor
public class PetPetGroupMedicalController implements PetGroupMedicalControllerSwagger {

    private final PetMedicalService petMedicalService;

    @Override
    @GetMapping("/info")
    public ResponseEntity<PetMedicalInfoResponse> getGroupMedicalInfo(
            @AuthMember Member member
    ) {
        PetMedicalInfoResponse response = petMedicalService.getGroupMedicalInfo(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/disease")
    public ResponseEntity<PetDiseaseRankingResponse> findPetDiseaseRanking(
            @AuthMember Member member
    ) {
        PetDiseaseRankingResponse response = petMedicalService.findPetDiseaseRanking(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/statistics")
    public ResponseEntity<PetMedicalStatisticsResponse> findGroupDieseaseStatistics(
            @AuthMember Member member
    ) {
        PetMedicalStatisticsResponse response = petMedicalService.findGroupMedicalStatistics(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/disease/cost")
    public ResponseEntity<TreatmentsResponse> getTreatment(
            @AuthMember Member member,
            @RequestParam(value = "disease") Disease disease
    ){
        TreatmentsResponse response = petMedicalService.getTreatment(member, disease);
        return ResponseEntity.ok(response);
    }
}
