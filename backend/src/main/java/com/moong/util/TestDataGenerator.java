package com.moong.util;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.GroupMedicalAdvice;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.entity.PetMedical;
import com.moong.domain.entity.Treatment;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.repository.CrewRepository;
import com.moong.repository.GroupExpenseRepository;
import com.moong.repository.GroupMedicalAdviceRepository;
import com.moong.repository.MemberRepository;
import com.moong.repository.PetGroupRepository;
import com.moong.repository.PetMedicalRepository;
import com.moong.repository.PetRepository;
import com.moong.repository.TreatmentRepository;
import com.moong.repository.memberexpense.MemberExpenseRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Profile("!test")
@Component
@RequiredArgsConstructor
public class TestDataGenerator {

    private final MemberRepository memberRepository;
    private final PetRepository petRepository;
    private final CrewRepository crewRepository;
    private final PetGroupRepository petGroupRepository;
    private final GroupMedicalAdviceRepository groupMedicalAdviceRepository;
    private final GroupExpenseRepository groupExpenseRepository;
    private final MemberExpenseRepository memberExpenseRepository;
    private final TreatmentRepository treatmentRepository;
    private final PetMedicalRepository petMedicalRepository;

    @Transactional
    @EventListener(ApplicationReadyEvent.class)
    public void generateTestData() {

        Member member1 = new Member("email1@email.com", "master1", "imageUrl1");
        Member member2 = new Member("email1@email.com", "master1", "imageUrl1");
        memberRepository.save(member1);
        memberRepository.save(member2);

        Pet pet1 = new Pet(null, "강아지1", Breed.BEA, Gender.M, LocalDate.now().minusYears(3L), "서울", "종로구");
        Pet pet2 = new Pet(null, "강아지2", Breed.BEA, Gender.M, LocalDate.now().minusYears(3L), "서울", "종로구");
        petRepository.save(pet1);
        petRepository.save(pet2);

        PetGroup petGroup1 = new PetGroup(pet1);
        PetGroup petGroup2 = new PetGroup(pet2);
        petGroupRepository.save(petGroup1);
        petGroupRepository.save(petGroup2);

        Crew crew1 = new Crew(petGroup1, member1);
        Crew crew2 = new Crew(petGroup2, member2);
        crewRepository.save(crew1);
        crewRepository.save(crew2);

        List<MemberExpense> exampleMemberExpense = getExampleMemberExpense(member1);
        memberExpenseRepository.saveAll(exampleMemberExpense);

        List<GroupExpense> exampleGroupExpense = getExampleGroupExpense(exampleMemberExpense, petGroup1);
        for (GroupExpense groupExpense : exampleGroupExpense) {
            groupExpenseRepository.save(groupExpense);
        }

        GroupMedicalAdvice groupMedicalAdvice = new GroupMedicalAdvice(
                null,
                "엄청엄청난 조언",
                100000000000L,
                LocalDate.now().plusYears(1L).getYear(),
                petGroup1
        );
        groupMedicalAdviceRepository.save(groupMedicalAdvice);

        for(Disease disease : Disease.values()) {
            PetMedical petMedical = new PetMedical(null, Breed.BEA, 0, Gender.M, disease, ThreadLocalRandom.current().nextInt(0, 10001));
            petMedicalRepository.save(petMedical);
        }

        saveExampleTreatment();
    }

    private void saveExampleTreatment() {

        for (Disease disease : Disease.values()) {
            for (int i = 0; i < 4; i++) {
                Treatment treatment = new Treatment(
                        null,
                        disease,
                        "예시 진료" + i,
                        "예시 설명" + i,
                        "서울",
                        "종로구",
                        300,
                        10000,
                        1000000
                );
                treatmentRepository.save(treatment);
            }
        }
    }

    private List<GroupExpense> getExampleGroupExpense(List<MemberExpense> memberExpense, PetGroup petGroup) {
        List<String> dogExpense = List.of("의료", "사료/간식", "미용", "물품구매비");
        return memberExpense.stream()
                .filter(expense -> dogExpense.contains(expense.getMainCategory()))
                .map(expense -> convertToGroupExpense(expense, petGroup))
                .toList();
    }

    public GroupExpense convertToGroupExpense(MemberExpense memberExpense, PetGroup petGroup) {
        return new GroupExpense(
                null,
                memberExpense,
                petGroup
        );
    }

    private List<MemberExpense> getExampleMemberExpense(Member member1) {
        LocalDateTime now = LocalDateTime.now();
        MemberExpense memberExpense1 = new MemberExpense(
                null,
                now.minusDays(1L).toLocalDate(),
                "급여",
                3000000,
                "급여",
                "",
                null,
                now,
                member1
        );

        MemberExpense memberExpense2 = new MemberExpense(
                null,
                now.minusDays(2L).toLocalDate(),
                "마트 장보기",
                150000,
                "식비",
                "",
                null,
                now,
                member1
        );

        MemberExpense memberExpense3 = new MemberExpense(
                null,
                now.minusDays(3L).toLocalDate(),
                "강아지 진료비",
                80000,
                "의료",
                "진료비",
                null,
                now,
                member1
        );

        MemberExpense memberExpense4 = new MemberExpense(
                null,
                now.minusDays(4L).toLocalDate(),
                "월세",
                800000,
                "주거/통신",
                "",
                null,
                now,
                member1
        );

        MemberExpense memberExpense5 = new MemberExpense(
                null,
                now.minusDays(5L).toLocalDate(),
                "강아지 사료 구매",
                45000,
                "사료/간식",
                "",
                null,
                now,
                member1
        );

        MemberExpense memberExpense6 = new MemberExpense(
                null,
                now.minusDays(6L).toLocalDate(),
                "예방접종",
                70000,
                "의료",
                "예방접종",
                null,
                now,
                member1
        );

        MemberExpense memberExpense7 = new MemberExpense(
                null,
                now.minusDays(7L).toLocalDate(),
                "영화 관람",
                30000,
                "여가/취미",
                "",
                null,
                now,
                member1
        );

        MemberExpense memberExpense8 = new MemberExpense(
                null,
                now.minusDays(8L).toLocalDate(),
                "애견 미용",
                50000,
                "미용",
                "",
                null,
                now,
                member1
        );

        MemberExpense memberExpense9 = new MemberExpense(
                null,
                now.minusDays(9L).toLocalDate(),
                "부수입",
                500000,
                "투자",
                "",
                null,
                now,
                member1
        );

        MemberExpense memberExpense10 = new MemberExpense(
                null,
                now.minusDays(10L).toLocalDate(),
                "강아지 장난감",
                25000,
                "물품구매비",
                "",
                null,
                now,
                member1
        );
        return List.of(memberExpense1, memberExpense2, memberExpense3, memberExpense4, memberExpense5,
                memberExpense6, memberExpense7, memberExpense8, memberExpense9, memberExpense10);
    }
}
