package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.PetGroupControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.dto.request.PetGroupParticipateRequest;
import com.moong.dto.response.petgroup.GroupCrewResponse;
import com.moong.dto.response.petgroup.PetGroupParticipateResponse;
import com.moong.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
            @RequestBody @Valid PetGroupParticipateRequest request
    ) {
        PetGroupParticipateResponse response = groupService.participate(member, request);
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/api/group/crews")
    public ResponseEntity<GroupCrewResponse> getCrews(
            @AuthMember Member member
    ) {
        GroupCrewResponse response = groupService.getCrews(member);
        return ResponseEntity.ok(response);
    }
}
