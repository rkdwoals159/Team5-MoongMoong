package com.moong.facade;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import com.moong.facade.report.MonthlyReportFacadeService;
import com.moong.service.BaseServiceTest;
import com.moong.service.MonthlyGroupExpenseService;
import com.moong.service.MonthlyMemberExpenseService;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@Disabled
class MonthlyReportFacadeServiceTest extends BaseServiceTest {

    @Autowired
    private MonthlyGroupExpenseService monthlyGroupExpenseService;

    @Autowired
    private MonthlyMemberExpenseService monthlyMemberExpenseService;

    @Autowired
    private MonthlyReportFacadeService monthlyReportFacadeService;

    @DisplayName("월별 그룹 레포트를 구성하여 메일로 발송한다")
    @Test
    void getMonthlyReport() {
        YearMonth now = YearMonth.now();
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);

        //회원 세팅
        Member member1 = memberGenerator.generateSaved("헬창재민");
        Member member2 = memberGenerator.generateSaved("존쿠");
        Member member3 = memberGenerator.generateSaved("카페인중독연진");
        Member member4 = memberGenerator.generateSaved("용데렐라");

        //그룹에 참여
        crewGenerator.generateSaveCrews(petGroup, List.of(member1, member2, member3, member4));

        //개인 소비내역 생성
        LocalDate today = LocalDate.now();
        MemberExpense usage1 = memberExpenseGenerator.generateSaved(
                today,
                "usage1",
                4L,
                MainCategoryType.MEDICAL_EXPENSES,
                SubCategoryType.CONSULTATION,
                "",
                null,
                member1
        );
        MemberExpense usage2 = memberExpenseGenerator.generateSaved(
                today,
                "usage1",
                3L,
                MainCategoryType.GROOMING,
                null,
                "",
                null,
                member2
        );
        MemberExpense usage3 = memberExpenseGenerator.generateSaved(
                today,
                "usage1",
                2L,
                MainCategoryType.SUPPLIES,
                null,
                "",
                null,
                member3
        );
        MemberExpense usage4 = memberExpenseGenerator.generateSaved(
                today,
                "usage1",
                1L,
                MainCategoryType.OTHER,
                null,
                "",
                null,
                member4
        );
        //그룹 Expense 세팅
        groupExpenseGenerator.generateSaved(petGroup, usage1);
        groupExpenseGenerator.generateSaved(petGroup, usage2);
        groupExpenseGenerator.generateSaved(petGroup, usage3);
        groupExpenseGenerator.generateSaved(petGroup, usage4);

        //월별 통계
        monthlyMemberExpenseService.saveAllMonthlyMemberExpense(now);
        monthlyGroupExpenseService.saveAllMonthlyGroupExpenses(now);

        //가져오기
        monthlyReportFacadeService.sendGroupMonthlyReport(now, petGroup.getId());
    }

    @DisplayName("통계가 나기 전에 즉석 발행하는 월별 개인 레포트를 구성하여 메일로 발송한다")
    @Test
    void publishTestReport() {
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);

        //회원 세팅
        Member member1 = memberGenerator.generateSaved("두존쿠johnkoo");
        Member member2 = memberGenerator.generateSaved("카페인중독연진");
        Member member3 = memberGenerator.generateSaved("헬창재민");
        Member member4 = memberGenerator.generateSaved("보드게임장인현민");

        //그룹에 참여
        crewGenerator.generateSaveCrews(petGroup, List.of(member1, member2, member3, member4));

        //개인 소비내역 생성
        LocalDate today = LocalDate.now();
        MemberExpense usage1 = memberExpenseGenerator.generateSaved(
                today,
                "usage1",
                4L,
                MainCategoryType.MEDICAL_EXPENSES,
                SubCategoryType.CONSULTATION,
                "",
                null,
                member1
        );
        MemberExpense usage2 = memberExpenseGenerator.generateSaved(
                today,
                "usage2",
                3L,
                MainCategoryType.SUPPLIES,
                null,
                "",
                null,
                member1
        );
        MemberExpense usage3 = memberExpenseGenerator.generateSaved(
                today,
                "usage3",
                2L,
                MainCategoryType.GROOMING,
                null,
                "",
                null,
                member1
        );
        MemberExpense usage4 = memberExpenseGenerator.generateSaved(
                today,
                "usage4",
                1L,
                MainCategoryType.OTHER,
                null,
                "",
                null,
                member1
        );
        MemberExpense usage5 = memberExpenseGenerator.generateSaved(
                today,
                "usage5",
                3L,
                MainCategoryType.GROOMING,
                null,
                "",
                null,
                member2
        );
        MemberExpense usage6 = memberExpenseGenerator.generateSaved(
                today,
                "usage6",
                2L,
                MainCategoryType.SUPPLIES,
                null,
                "",
                null,
                member3
        );
        MemberExpense usage7 = memberExpenseGenerator.generateSaved(
                today,
                "usage6",
                1L,
                MainCategoryType.OTHER,
                null,
                "",
                null,
                member4
        );
        //그룹 Expense 세팅
        groupExpenseGenerator.generateSaved(petGroup, usage1);
        groupExpenseGenerator.generateSaved(petGroup, usage2);
        groupExpenseGenerator.generateSaved(petGroup, usage3);
        groupExpenseGenerator.generateSaved(petGroup, usage4);
        groupExpenseGenerator.generateSaved(petGroup, usage5);
        groupExpenseGenerator.generateSaved(petGroup, usage6);
        groupExpenseGenerator.generateSaved(petGroup, usage7);

        //가져오기
        monthlyReportFacadeService.sendThisMonthReport(member1);
    }
}
