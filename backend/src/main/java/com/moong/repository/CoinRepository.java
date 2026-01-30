package com.moong.repository;

import com.moong.domain.bank.CoinView;
import com.moong.domain.entity.Coin;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface CoinRepository extends Repository<Coin, Long> {

    Coin save(Coin coin);

    @Query("""
        select c
        from Coin c
        join fetch c.crew cr
        join fetch cr.member
        where c.bank.id = :bankId
        """
    )
    List<Coin> findFetchedAllByBank_Id(@Param(value = "bankId") long bankId, Sort sort);

    default List<CoinView> getFetchedAllByBank_Id(long bankId, Sort sort) {
        List<Coin> coins = findFetchedAllByBank_Id(bankId, sort);
        return coins.stream()
                .map(coin -> new CoinView(coin, coin.getCrew().getMember()))
                .toList();
    }
}
