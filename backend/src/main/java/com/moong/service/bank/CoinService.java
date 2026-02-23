package com.moong.service.bank;

import com.moong.domain.bank.Bank;
import com.moong.domain.bank.Coin;
import com.moong.domain.crew.Crew;
import com.moong.domain.petgroup.PetGroup;
import com.moong.domain.enums.PaymentStatus;
import com.moong.repository.bank.BankRepository;
import com.moong.repository.bank.CoinPaymentRepository;
import com.moong.repository.bank.CoinRepository;
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
