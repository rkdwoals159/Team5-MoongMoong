package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.BankControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.dto.request.bank.BankCreateRequest;
import com.moong.dto.response.bank.BankBreakResponse;
import com.moong.dto.response.bank.BankCreateResponse;
import com.moong.dto.response.bank.BankInfoResponse;
import com.moong.service.BankService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/group/bank")
@RequiredArgsConstructor
public class BankController implements BankControllerSwagger {

    private final BankService bankService;

    @Override
    @PostMapping
    public ResponseEntity<BankCreateResponse> createBank(
            @AuthMember Member member,
            @RequestBody BankCreateRequest request
    ) {
        BankCreateResponse response = bankService.createBank(member, request);
        return ResponseEntity.ok(response);
    }
  
    @Override
    @GetMapping
    public ResponseEntity<BankInfoResponse> findBankInfo(
            @AuthMember Member member
    ) {
        BankInfoResponse response = bankService.findBankInfo(member);
        return ResponseEntity.ok(response);
    }
  
    @Override
    @DeleteMapping
    public ResponseEntity<BankBreakResponse> breakBank(
            @AuthMember Member member
    ) {
        BankBreakResponse response = bankService.breakBank(member);
        return ResponseEntity.ok(response);
    }
}
