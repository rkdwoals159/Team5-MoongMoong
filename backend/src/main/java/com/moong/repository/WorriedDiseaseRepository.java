package com.moong.repository;

import com.moong.domain.entity.WorriedDisease;
import java.util.List;
import org.springframework.data.repository.Repository;

public interface WorriedDiseaseRepository extends Repository<WorriedDisease, Long> {

    WorriedDisease save(WorriedDisease worriedDisease);

    default void saveAll(List<WorriedDisease> worriedDiseases) {
        for (WorriedDisease worriedDisease : worriedDiseases) {
            save(worriedDisease);
        }
    }

    List<WorriedDisease> findAll();
}
