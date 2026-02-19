package com.moong.service;

import com.moong.domain.entity.CoinPayment;
import com.moong.domain.enums.PaymentStatus;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.CoinPaymentRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final CoinPaymentRepository coinPaymentRepository;

    public CoinPayment saveCoinPayment(CoinPayment coinPayment) {
        return coinPaymentRepository.save(coinPayment);
    }

    @Transactional
    public void changePaymentStatus(
            UUID orderId,
            long crewId,
            PaymentStatus fromStatus,
            PaymentStatus toStatus
    ) {
        coinPaymentRepository.changePaymentStatusByIdAndCrewId(orderId, crewId, fromStatus, toStatus);
    }

    public void verifyPayment(UUID orderId,  long crewId, long amount) {
        CoinPayment coinPayment = coinPaymentRepository.getByIdAndCrewId(orderId, crewId);

        if (!coinPayment.hasStatus(PaymentStatus.READY)) {
            throw new BusinessException(ErrorCode.ALREADY_PROCESSED);
        }
        if (!coinPayment.hasSameAmount(amount)) {
            throw new BusinessException(ErrorCode.MISMATCH_PAYMENT_AMOUNT);
        }
    }
}
