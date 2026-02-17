package com.moong.domain.member;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class MemberNameTest {

    @DisplayName("회원 이름은 1자 이상 10자 이하여야 한다")
    @ValueSource(ints = {MemberName.MEMBER_NAME_MIN_LENGTH - 1, MemberName.MEMBER_NAME_MAX_LENGTH + 1})
    @ParameterizedTest
    void validate(int invalidLength) {
        String invalidName = "j".repeat(invalidLength);

        assertThatThrownBy(() -> new MemberName(invalidName))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.INVALID_MEMBER_NAME.getMessage());
    }

}
