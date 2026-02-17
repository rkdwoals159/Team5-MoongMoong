package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.MemberControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.dto.request.member.MemberUpdateNameRequest;
import com.moong.dto.request.member.MemberUpdateProfileRequest;
import com.moong.dto.response.member.MemberInfoResponse;
import com.moong.dto.response.member.MemberUpdateNameResponse;
import com.moong.dto.response.member.MemberUpdateProfileResponse;
import com.moong.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MemberController implements MemberControllerSwagger {

    private final MemberService memberService;

    @Override
    @GetMapping("/api/member")
    public ResponseEntity<MemberInfoResponse> findMember(@AuthMember Member member) {
        return ResponseEntity.ok(new MemberInfoResponse(member));
    }

    @Override
    @PatchMapping("/api/member/profile")
    public ResponseEntity<MemberUpdateProfileResponse> updateProfile(
            @AuthMember Member member,
            @Valid @RequestBody MemberUpdateProfileRequest request
    ) {
        MemberUpdateProfileResponse response = memberService.updateProfile(member, request);
        return ResponseEntity.ok(response);
    }

    @Override
    @PatchMapping("/api/member/name")
    public ResponseEntity<MemberUpdateNameResponse> updateName(
            @AuthMember Member member,
            @Valid @RequestBody MemberUpdateNameRequest request
    ) {
        MemberUpdateNameResponse response = memberService.updateName(member, request);
        return ResponseEntity.ok(response);
    }
}
