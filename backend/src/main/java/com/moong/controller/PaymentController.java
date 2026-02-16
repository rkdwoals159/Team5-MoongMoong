package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.PaymentControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.dto.request.bank.CoinCreateRequest;
import com.moong.dto.request.payment.CoinPaymentConfirmRequest;
import com.moong.dto.request.payment.CoinPaymentFailRequest;
import com.moong.dto.response.bank.CoinCreateResponse;
import com.moong.dto.response.bank.CoinPaymentCreateResponse;
import com.moong.facade.payment.PaymentFacadeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/group/bank/coins")
@RequiredArgsConstructor
public class PaymentController implements PaymentControllerSwagger {

    private final PaymentFacadeService paymentFacadeService;

    @Override
    @PostMapping
    public ResponseEntity<CoinPaymentCreateResponse> createCoinPayment(
            @AuthMember Member member,
            @RequestBody @Valid CoinCreateRequest request
    ) {
        CoinPaymentCreateResponse response = paymentFacadeService.createCoinPayment(member, request);
        return ResponseEntity.ok(response);
    }

    @Override
    @PostMapping("/confirm")
    public ResponseEntity<CoinCreateResponse> paymentSuccess(
            @AuthMember Member member,
            @RequestBody @Valid CoinPaymentConfirmRequest request
    ) {
        CoinCreateResponse response = paymentFacadeService.paymentSuccess(member, request);
        return ResponseEntity.ok(response);
    }

    @Override
    @PostMapping("/fail")
    public ResponseEntity<Void> paymentFailure(
            @AuthMember Member member,
            @RequestBody @Valid CoinPaymentFailRequest request
    ) {
        paymentFacadeService.paymentFailure(member, request);
        return ResponseEntity.noContent().build();
    }
}
