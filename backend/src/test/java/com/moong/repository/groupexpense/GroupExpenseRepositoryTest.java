package com.moong.repository.groupexpense;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.groupexpense.GroupExpenseDetail;
import com.moong.repository.BaseRepositoryTest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceUnitUtil;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;

class GroupExpenseRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private GroupExpenseRepository groupExpenseRepository;

    @Autowired
    private EntityManager entityManager;

    @DisplayName("그룹 ID와 기간으로 조회 시, 연관된 MemberExpense와 Member를 Fetch Join으로 함께 조회한다.")
    @Test
    void findFetchedByGroupIdAndPeriod_fetchJoin_test() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);

        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(1L).plusSeconds(1L),
                coli
        );

        groupExpenseGenerator.generateSaved(petGroup, memberExpense1, coli.getName());

        Sort expenseSort = Sort.by(
                Sort.Order.desc(GroupExpense.MEMBER_EXPENSE_FILED_NAME + "." + MemberExpense.SPENT_AT_COLUMN_NAME),
                Sort.Order.desc(GroupExpense.MEMBER_EXPENSE_FILED_NAME + "." + MemberExpense.MODIFIED_AT_COLUMN_NAME)
        );
        entityManager.flush();
        entityManager.clear();

        List<GroupExpense> actual = groupExpenseRepository.findFetchedByGroupIdAndPeriod(
                petGroup.getId(),
                now.minusDays(1L).toLocalDate(),
                now.toLocalDate(),
                expenseSort
        );


        assertThat(actual).hasSize(1);

        GroupExpense fetched = actual.get(0);
        PersistenceUnitUtil util =
                entityManager.getEntityManagerFactory().getPersistenceUnitUtil();

        assertThat(util.isLoaded(fetched, "memberExpense")).isTrue();

        MemberExpense fetchedMe = fetched.getMemberExpense();
        assertThat(util.isLoaded(fetchedMe, "member")).isTrue();

        assertThat(fetchedMe.getMember().getEmail()).isNotNull();
    }

    @DisplayName("그룹 ID와 메인 카테고리, 기간으로 조회 시, 연관된 MemberExpense와 Member를 Fetch Join으로 함께 조회한다.")
    @Test
    void findFetchedByPetGroupIdAndMainCategoryAndPeriod_fetchJoin_test() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);

        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(1L).plusSeconds(1L),
                coli
        );

        groupExpenseGenerator.generateSaved(petGroup, memberExpense1, coli.getName());

        Sort expenseSort = Sort.by(
                Sort.Order.desc(GroupExpense.MEMBER_EXPENSE_FILED_NAME + "." + MemberExpense.SPENT_AT_COLUMN_NAME),
                Sort.Order.desc(GroupExpense.MEMBER_EXPENSE_FILED_NAME + "." + MemberExpense.MODIFIED_AT_COLUMN_NAME)
        );
        entityManager.flush();
        entityManager.clear();

        List<GroupExpense> actual = groupExpenseRepository.findFetchedByPetGroupIdAndMainCategoryAndPeriod(
                petGroup.getId(),
                MainCategoryType.FOOD_AND_TREATS,
                now.minusDays(1L).toLocalDate(),
                now.toLocalDate(),
                expenseSort
        );


        assertThat(actual).hasSize(1);

        GroupExpense fetched = actual.get(0);
        PersistenceUnitUtil util =
                entityManager.getEntityManagerFactory().getPersistenceUnitUtil();

        assertThat(util.isLoaded(fetched, "memberExpense")).isTrue();

        MemberExpense fetchedMe = fetched.getMemberExpense();
        assertThat(util.isLoaded(fetchedMe, "member")).isTrue();

        assertThat(fetchedMe.getMember().getEmail()).isNotNull();
    }

    @DisplayName("기간내 그룹 소비를 정렬(spendAt desc > createdAt desc) 기준에 맞추어 가져온다")
    @Test
    void findFetchedByGroupIdAndPeriod() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);

        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(1L).plusSeconds(1L),
                coli
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "항아리 수제비",
                200,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(1L),
                coli
        );
        MemberExpense memberExpense3 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "우럭 회",
                300,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now,
                coli
        );

        GroupExpense expense1 = groupExpenseGenerator.generateSaved(petGroup, memberExpense1, coli.getName());
        GroupExpense expense2 = groupExpenseGenerator.generateSaved(petGroup, memberExpense2, coli.getName());
        GroupExpense expense3 = groupExpenseGenerator.generateSaved(petGroup, memberExpense3, coli.getName());
        Sort expenseSort = Sort.by(
                Sort.Order.desc(GroupExpense.MEMBER_EXPENSE_FILED_NAME + "." + MemberExpense.SPENT_AT_COLUMN_NAME),
                Sort.Order.desc(GroupExpense.MEMBER_EXPENSE_FILED_NAME + "." + MemberExpense.MODIFIED_AT_COLUMN_NAME)
        );

        List<GroupExpenseDetail> actual = groupExpenseRepository.getFetchedByGroupIdAndPeriod(
                petGroup.getId(),
                now.minusDays(1L).toLocalDate(),
                now.toLocalDate(),
                expenseSort
        );

        assertThat(actual)
                .extracting(GroupExpenseDetail::getMemberExpenseId)
                .containsExactly(
                        expense3.getMemberExpense().getId(),
                        expense1.getMemberExpense().getId(),
                        expense2.getMemberExpense().getId()
                );
    }

    @DisplayName("기간내 카테고리에 대한 그룹 소비를 정렬(spendAt desc > createdAt desc) 기준에 맞추어 가져온다")
    @Test
    void findFetchedByPetGroupIdAndMainCategoryAndPeriod() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);

        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(1L).plusSeconds(1L),
                coli
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "항아리 수제비",
                200,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(1L),
                coli
        );
        MemberExpense memberExpense3 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "수건 구입",
                300,
                MainCategoryType.SUPPLIES,
                null,
                "메모",
                now,
                coli
        );

        GroupExpense expense1 = groupExpenseGenerator.generateSaved(petGroup, memberExpense1, coli.getName());
        GroupExpense expense2 = groupExpenseGenerator.generateSaved(petGroup, memberExpense2, coli.getName());
        Sort expenseSort = Sort.by(
                Sort.Order.desc(GroupExpense.MEMBER_EXPENSE_FILED_NAME + "." + MemberExpense.SPENT_AT_COLUMN_NAME),
                Sort.Order.desc(GroupExpense.MEMBER_EXPENSE_FILED_NAME + "." + MemberExpense.MODIFIED_AT_COLUMN_NAME)
        );

        List<GroupExpenseDetail> actual = groupExpenseRepository.getFetchedByPetGroupIdAndMainCategoryAndPeriod(
                petGroup.getId(),
                MainCategoryType.FOOD_AND_TREATS,
                now.minusDays(1L).toLocalDate(),
                now.toLocalDate(),
                expenseSort
        );

        assertThat(actual)
                .extracting(GroupExpenseDetail::getMemberExpenseId)
                .containsExactly(
                        expense1.getMemberExpense().getId(),
                        expense2.getMemberExpense().getId()
                );
    }

    @DisplayName("그룹의 소비내역 대량 삭제를 확인한다.")
    @Test
    void deleteByMemberIdAndIds() {
        LocalDateTime now = LocalDateTime.now();
        Member member = memberGenerator.generateSaved("멤버1");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(2L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(2L),
                member
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "항아리 수제비",
                200,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(1L),
                member
        );
        MemberExpense memberExpense3 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "우럭 회",
                300,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now,
                member
        );
        List<MemberExpense> memberExpenses = List.of(memberExpense1, memberExpense2, memberExpense3);
        List<Long> ids = memberExpenses.stream()
                .map(MemberExpense::getId)
                .toList();
        groupExpenseGenerator.generateSaved(petGroup, memberExpense1, null);
        groupExpenseGenerator.generateSaved(petGroup, memberExpense2, null);
        groupExpenseGenerator.generateSaved(petGroup, memberExpense3, null);

        groupExpenseRepository.deleteByGroupIdAndMemberExpenseIds(petGroup.getId(), ids);

        List<GroupExpense> found = groupExpenseRepository.findAllByPetGroupId(petGroup.getId());
        assertThat(found).isEmpty();
    }
}
