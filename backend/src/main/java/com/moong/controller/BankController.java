package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.BankControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.dto.request.bank.BankCreateRequest;
import com.moong.dto.request.bank.BankUpdateRequest;
import com.moong.dto.response.bank.BankBreakResponse;
import com.moong.dto.response.bank.BankCreateResponse;
import com.moong.dto.response.bank.BankInfoResponse;
import com.moong.dto.response.bank.BankUpdateResponse;
import com.moong.dto.response.bank.CoinsResponse;
import com.moong.facade.bank.BankFacadeService;
import com.moong.service.BankService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/group/bank")
@RequiredArgsConstructor
public class BankController implements BankControllerSwagger {

    private final BankFacadeService bankFacadeService;
    private final BankService bankService;

    @Override
    @PostMapping
    public ResponseEntity<BankCreateResponse> createBank(
            @AuthMember Member member,
            @RequestBody @Valid BankCreateRequest request
    ) {
        BankCreateResponse response = bankService.createBank(member, request);
        return ResponseEntity.ok(response);
    }

    @Override
    @PostMapping("/nudge")
    public ResponseEntity<Void> createGroupNudge(
            @AuthMember Member member
    ) {
        bankFacadeService.createGroupNudge(member);
        return ResponseEntity.ok().build();
    }

    @Override
    @GetMapping
    public ResponseEntity<BankInfoResponse> findBankInfo(
            @AuthMember Member member
    ) {
        BankInfoResponse response = bankService.findBankInfo(member);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/coins")
    public ResponseEntity<CoinsResponse> findCoins(
            @AuthMember Member member
    ) {
        CoinsResponse response = bankService.findCoins(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @DeleteMapping
    public ResponseEntity<BankBreakResponse> breakBank(
            @AuthMember Member member
    ) {
        BankBreakResponse response = bankFacadeService.breakBank(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @PatchMapping
    public ResponseEntity<BankUpdateResponse> updateBank(
            @AuthMember Member member,
            @RequestBody @Valid BankUpdateRequest request
    ) {
        BankUpdateResponse response = bankService.updateBank(member, request);
        return ResponseEntity.ok(response);
    }
}
