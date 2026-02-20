package com.moong.repository;

import com.moong.config.JpaAuditingConfig;
import com.moong.fixture.CrewGenerator;
import com.moong.fixture.GroupExpenseGenerator;
import com.moong.fixture.GroupMedicalAdviceGenerator;
import com.moong.fixture.MemberExpenseGenerator;
import com.moong.fixture.MemberGenerator;
import com.moong.fixture.MonthlyGroupExpenseGenerator;
import com.moong.fixture.MonthlyMemberExpenseGenerator;
import com.moong.fixture.PetGenerator;
import com.moong.fixture.PetGroupGenerator;
import com.moong.fixture.PetMedicalGenerator;
import com.moong.fixture.WorriedDiseaseGenerator;
import com.moong.util.query.MemberExpenseDynamicQueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@Import({
        WorriedDiseaseGenerator.class,
        PetGenerator.class,
        PetGroupGenerator.class,
        GroupExpenseGenerator.class,
        MemberGenerator.class,
        CrewGenerator.class,
        MemberExpenseGenerator.class,
        GroupMedicalAdviceGenerator.class,
        PetMedicalGenerator.class,
        MemberExpenseDynamicQueryBuilder.class,
        MonthlyGroupExpenseGenerator.class,
        MonthlyMemberExpenseGenerator.class,
        JpaAuditingConfig.class
})
@ActiveProfiles("test")
public abstract class BaseRepositoryTest {

    @Autowired
    protected PetGenerator petGenerator;

    @Autowired
    protected WorriedDiseaseGenerator worriedDiseaseGenerator;

    @Autowired
    protected PetGroupGenerator petGroupGenerator;

    @Autowired
    protected CrewGenerator crewGenerator;

    @Autowired
    protected GroupExpenseGenerator groupExpenseGenerator;

    @Autowired
    protected MemberGenerator memberGenerator;

    @Autowired
    protected MemberExpenseGenerator memberExpenseGenerator;

    @Autowired
    protected GroupMedicalAdviceGenerator groupMedicalAdviceGenerator;

    @Autowired
    protected PetMedicalGenerator petMedicalGenerator;

    @Autowired
    protected MonthlyGroupExpenseGenerator monthlyGroupExpenseGenerator;

    @Autowired
    protected MonthlyMemberExpenseGenerator monthlyMemberExpenseGenerator;
}
