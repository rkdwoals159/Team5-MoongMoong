package com.moong.repository.petmedical;

import com.moong.domain.petmedical.PetMedical;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Gender;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

public interface PetMedicalRepository extends Repository<PetMedical, Long>, PetMedicalJdbcRepository {

    PetMedical save(PetMedical petMedical);

    @Query("""
         SELECT p
            FROM PetMedical p
            WHERE p.createdAt >= :start
              AND p.createdAt < :end
              AND p.age = :age
              AND p.gender = :gender
              AND p.breed = :breed
            ORDER BY p.ratio DESC
            LIMIT 1
        """
    )
    Optional<PetMedical> findLatestTopByBreedAndAgeAndGenderOrderByRatioDesc(
            Breed breed,
            int age,
            Gender gender,
            LocalDateTime start,
            LocalDateTime end
    );

    default PetMedical findTopRatioPetMedical(Breed breed, int age, Gender gender) {
        LocalDate latestDate = findLatestCreatedDate()
                .orElseThrow(() -> new BusinessException(ErrorCode.PET_MEDICAL_NOT_FOUND))
                .toLocalDate();
        return findLatestTopByBreedAndAgeAndGenderOrderByRatioDesc(
                breed, age, gender, latestDate.atStartOfDay(), latestDate.plusDays(1).atStartOfDay()
        ).orElseThrow(() -> new BusinessException(ErrorCode.PET_MEDICAL_NOT_FOUND));
    }

    default List<PetMedical> findByBreedAndAgeAndGender(Breed breed, int age, Gender gender) {
        LocalDate latestDate = findLatestCreatedDate()
                .orElseThrow(() -> new BusinessException(ErrorCode.PET_MEDICAL_NOT_FOUND))
                .toLocalDate();
        return findMedicalByBreedAndAgeAndGenderAndCreatedAtBetween(
                breed,
                age,
                gender,
                latestDate.atStartOfDay(),
                latestDate.plusDays(1).atStartOfDay()
        );
    }

    default List<PetMedical> findByBreedAndGenderAndAgeBetween(Breed breed, Gender gender, int minAge, int maxAge) {
        LocalDate latestDate = findLatestCreatedDate()
                .orElseThrow(() -> new BusinessException(ErrorCode.PET_MEDICAL_NOT_FOUND))
                .toLocalDate();
        return findByBreedAndGenderAndAgeBetweenAndCreatedAtBetween(
                breed,
                gender,
                minAge,
                maxAge,
                latestDate.atStartOfDay(),
                latestDate.plusDays(1).atStartOfDay()
        );
    }

    @Query("""
            SELECT MAX(pm.createdAt)
            FROM PetMedical pm
            """
    )
    Optional<LocalDateTime> findLatestCreatedDate();

    @Query("""
            SELECT p
            FROM PetMedical p
            WHERE p.createdAt >= :start
              AND p.createdAt < :end
                AND p.age = :age
                AND p.gender = :gender
                AND p.breed = :breed
            """)
    List<PetMedical> findMedicalByBreedAndAgeAndGenderAndCreatedAtBetween(
            Breed breed,
            int age,
            Gender gender,
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("""
            SELECT p
            FROM PetMedical p
            WHERE p.createdAt >= :start
              AND p.createdAt < :end
              AND p.age <= :maxAge
              AND p.age >= :minAge
              AND p.gender = :gender
              AND p.breed = :breed
            """)
    List<PetMedical> findByBreedAndGenderAndAgeBetweenAndCreatedAtBetween(
            Breed breed,
            Gender gender,
            int minAge,
            int maxAge,
            LocalDateTime start,
            LocalDateTime end
    );
}
