package com.moong.fixture;

import com.moong.domain.entity.CoinPayment;
import com.moong.domain.entity.Crew;
import com.moong.domain.enums.PaymentStatus;
import com.moong.repository.CoinPaymentRepository;
import org.springframework.stereotype.Component;

@Component
public class CoinPaymentGenerator {

    private final CoinPaymentRepository coinPaymentRepository;

    public CoinPaymentGenerator(CoinPaymentRepository coinPaymentRepository) {
        this.coinPaymentRepository = coinPaymentRepository;
    }

    public CoinPayment generateSaved(long amount, Crew crew) {
        CoinPayment coinPayment = new CoinPayment(null, amount, crew, PaymentStatus.READY);
        return coinPaymentRepository.save(coinPayment);
    }

    public CoinPayment generateSaved(long amount, Crew crew, PaymentStatus paymentStatus) {
        CoinPayment coinPayment = new CoinPayment(null, amount, crew, paymentStatus);
        return coinPaymentRepository.save(coinPayment);
    }
}
