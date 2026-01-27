package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.GroupMedicalControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.dto.response.GroupMedicalInfoResponse;
import com.moong.service.GroupMedicalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
