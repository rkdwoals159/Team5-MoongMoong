package com.moong.fixture;

import com.moong.domain.entity.Bank;
import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Crew;
import com.moong.repository.CoinRepository;
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
