package com.moong.repository;

import com.moong.domain.entity.CoinPayment;
import com.moong.domain.enums.PaymentStatus;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import jakarta.persistence.LockModeType;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface CoinPaymentRepository extends Repository<CoinPayment, UUID> {

    CoinPayment save(CoinPayment coinOrder);

    Optional<CoinPayment> findByIdAndCrew_Id(UUID id, long crewId);

    default CoinPayment getByIdAndCrewId(UUID id, long crewId) {
        return findByIdAndCrew_Id(id, crewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NO_SUCH_COIN_PAYMENT_FOUND));
    }

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            update CoinPayment cp
            set cp.paymentStatus = :toStatus
            where cp.id = :orderId and cp.crew.id = :crewId  and cp.paymentStatus = :fromStatus
            """)
    void changePaymentStatusByIdAndCrewId(
            @Param("orderId") UUID orderId,
            @Param("crewId") long crewId,
            @Param("fromStatus") PaymentStatus fromStatus,
            @Param("toStatus") PaymentStatus toStatus
    );
}
