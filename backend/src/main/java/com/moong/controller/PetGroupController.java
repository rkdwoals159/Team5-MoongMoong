package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.PetGroupControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.dto.request.PetGroupParticipateRequest;
import com.moong.dto.response.petgroup.PetGroupParticipateResponse;
import com.moong.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PetGroupController implements PetGroupControllerSwagger {

    private final GroupService groupService;

    @Override
    @PostMapping("/api/group/participate")
    public ResponseEntity<PetGroupParticipateResponse> participate(
            @AuthMember Member member,
            @RequestBody PetGroupParticipateRequest request
    ) {
        PetGroupParticipateResponse response = groupService.participate(member, request);
        return ResponseEntity.ok(response);
    }
}
