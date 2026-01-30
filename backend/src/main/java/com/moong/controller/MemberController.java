package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.domain.entity.Member;
import com.moong.dto.response.member.MemberInfoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MemberController {

    @GetMapping("/api/member")
    public ResponseEntity<MemberInfoResponse> findMember(@AuthMember Member member) {
        return ResponseEntity.ok(new MemberInfoResponse(member));
    }
}
