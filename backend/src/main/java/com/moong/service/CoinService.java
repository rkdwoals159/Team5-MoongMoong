package com.moong.service;

import com.moong.domain.entity.Bank;
import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.enums.PaymentStatus;
import com.moong.repository.BankRepository;
import com.moong.repository.CoinPaymentRepository;
import com.moong.repository.CoinRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CoinService {

    private final CoinPaymentRepository coinPaymentRepository;
    private final BankRepository bankRepository;
    private final CoinRepository coinRepository;

    @Transactional
    public Coin createCoin(UUID orderId, Crew crew, long amount) {
        PetGroup petGroup = crew.getPetGroup();
        Bank groupBank = bankRepository.getByPetGroupId(petGroup.getId());
        groupBank.updateCurrentAmount(amount);
        Coin coin = new Coin(groupBank, crew, amount);
        coinPaymentRepository.changePaymentStatusByIdAndCrewId(
                orderId,
                crew.getId(),
                PaymentStatus.CONFIRMED,
                PaymentStatus.DONE
        );
        return coinRepository.save(coin);
    }
}
