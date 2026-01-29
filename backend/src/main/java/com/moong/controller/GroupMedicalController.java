package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.GroupMedicalControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.domain.enums.Disease;
import com.moong.dto.response.groupmedical.GroupMedicalInfoResponse;
import com.moong.dto.response.groupmedical.GroupMedicalStatisticsResponse;
import com.moong.dto.response.groupmedical.TreatmentsResponse;
import com.moong.dto.response.groupmedical.PetDiseaseRankingResponse;
import com.moong.service.GroupMedicalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/group/medical")
@RequiredArgsConstructor
public class GroupMedicalController implements GroupMedicalControllerSwagger {

    private final GroupMedicalService groupMedicalService;

    @Override
    @GetMapping("/info")
    public ResponseEntity<GroupMedicalInfoResponse> getGroupMedicalInfo(
            @AuthMember Member member
    ) {
        GroupMedicalInfoResponse response = groupMedicalService.getGroupMedicalInfo(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/disease")
    public ResponseEntity<PetDiseaseRankingResponse> findPetDiseaseRanking(
            @AuthMember Member member
    ) {
        PetDiseaseRankingResponse response = groupMedicalService.findPetDiseaseRanking(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/statistics")
    public ResponseEntity<GroupMedicalStatisticsResponse> findGroupDieseaseStatistics(
            @AuthMember Member member
    ) {
        GroupMedicalStatisticsResponse response = groupMedicalService.findGroupMedicalStatistics(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/disease/cost")
    public ResponseEntity<TreatmentsResponse> getTreatment(
            @AuthMember Member member,
            @RequestParam(value = "disease") Disease disease
    ){
        TreatmentsResponse response = groupMedicalService.getTreatment(member, disease);
        return ResponseEntity.ok(response);
    }
}
