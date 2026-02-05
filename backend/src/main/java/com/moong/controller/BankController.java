package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.BankControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.dto.request.bank.BankCreateRequest;
import com.moong.dto.request.payment.CoinPaymentConfirmRequest;
import com.moong.dto.request.payment.CoinPaymentFailRequest;
import com.moong.dto.request.bank.BankUpdateRequest;
import com.moong.dto.request.bank.CoinCreateRequest;
import com.moong.dto.response.bank.BankBreakResponse;
import com.moong.dto.response.bank.BankCreateResponse;
import com.moong.dto.response.bank.BankInfoResponse;
import com.moong.dto.response.bank.BankUpdateResponse;
import com.moong.dto.response.bank.CoinCreateResponse;
import com.moong.dto.response.bank.CoinPaymentCreateResponse;
import com.moong.dto.response.bank.CoinsResponse;
import com.moong.service.BankService;
import java.time.LocalDateTime;
import java.util.UUID;
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
        BankBreakResponse response = bankService.breakBank(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @PatchMapping
    public ResponseEntity<BankUpdateResponse> updateBank(
            @AuthMember Member member,
            @RequestBody BankUpdateRequest request
    ) {
        BankUpdateResponse response = bankService.updateBank(member, request);
        return ResponseEntity.ok(response);
    }

    @Override
    @PostMapping("/coins")
    public ResponseEntity<CoinPaymentCreateResponse> createCoinPayment(
            @AuthMember Member member,
            @RequestBody CoinCreateRequest request
    ) {
//        CoinPaymentCreateResponse response = bankService.createCoin(member, request);
        CoinPaymentCreateResponse response = new CoinPaymentCreateResponse(
                UUID.fromString("8973f452-cabc-4098-bdd9-d32737c86a33"), 1000L);
        return ResponseEntity.ok(response);
    }

    @Override
    @PostMapping("/coins/confirm")
    public ResponseEntity<CoinCreateResponse> paymentSuccess(
            @AuthMember Member member,
            @RequestBody CoinPaymentConfirmRequest request
    ) {
//        CoinCreateResponse response = bankService.paymentSuccess(member, request);
        CoinCreateResponse response = new CoinCreateResponse(10L, LocalDateTime.now(), 1000L, "테스트");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/coins/fail")
    @Override
    public ResponseEntity<Void> paymentFailure(
            @AuthMember Member member,
            @RequestBody CoinPaymentFailRequest request
    ) {
//        bankService.paymentFailure(member, request);
        return ResponseEntity.noContent().build();
    }
}
