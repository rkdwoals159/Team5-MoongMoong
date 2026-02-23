package com.moong.fixture;

import com.moong.domain.bank.Bank;
import com.moong.domain.bank.Coin;
import com.moong.domain.crew.Crew;
import com.moong.repository.bank.CoinRepository;
import org.springframework.stereotype.Component;

@Component
public class CoinGenerator {

    private final CoinRepository coinRepository;

    public CoinGenerator(CoinRepository coinRepository) {
        this.coinRepository = coinRepository;
    }

    public Coin generateSaved(Bank bank, Crew crew, long amount) {
        Coin coin = new Coin(null, bank, crew, amount);
        return coinRepository.save(coin);
    }
}
