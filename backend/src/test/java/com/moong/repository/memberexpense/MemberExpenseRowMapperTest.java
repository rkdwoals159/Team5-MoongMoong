package com.moong.repository.memberexpense;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;

import com.moong.domain.entity.Member;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class MemberExpenseRowMapperTest {

    @DisplayName("회원 소비내역 데이터 행 매핑과정에서 에러가 생기면 전환한다")
    @Test
    void mappingError() throws SQLException {
        Member member = new Member(1L, "email@email.com", "name", "imageUrl");
        MemberExpenseRowMapper rowMapper = new MemberExpenseRowMapper(member);
        ResultSet resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.getLong(anyString()))
                .thenThrow(new SQLException());

        assertThatThrownBy(() -> rowMapper.mapRow(resultSet, 0))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.MEMBER_EXPENSE_ROW_MAPPING_ERROR.getMessage());
    }
}
