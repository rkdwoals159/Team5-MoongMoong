package com.moong.domain.member;

import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
public class MemberName {

    public static final int MEMBER_NAME_MIN_LENGTH = 1;
    public static final int MEMBER_NAME_MAX_LENGTH = 10;

    private final String value;

    public MemberName(String value) {
        validate(value);
        this.value = value;
    }

    private void validate(String value) {
        if(value == null || value.isBlank() || value.length() > MEMBER_NAME_MAX_LENGTH) {
            throw new BusinessException(ErrorCode.INVALID_MEMBER_NAME);
        }
    }
}
