package com.moong.util;

import com.moong.controller.tool.auth.AuthorizationHeaderExtractor;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class AuthorizationHeaderExtractorTest {

    private final AuthorizationHeaderExtractor extractor = new AuthorizationHeaderExtractor();

    @DisplayName("Authorization 헤더에서 Bearer 토큰을 추출할 수 있다.")
    @Test
    void extractBearerToken_success() {
        String token = extractor.extractBearerToken("Bearer abc.def.ghi");

        assertThat(token).isEqualTo("abc.def.ghi");
    }

    @DisplayName("Authorization 헤더가 null이면 UNAUTHORIZED_EXCEPTION을 던진다.")
    @Test
    void extractBearerToken_fail_null() {
        assertThatThrownBy(() -> extractor.extractBearerToken(null))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.UNAUTHORIZED_EXCEPTION.getMessage());
    }

    @DisplayName("Authorization 헤더가 공백이면 UNAUTHORIZED_EXCEPTION을 던진다.")
    @Test
    void extractBearerToken_fail_blank() {
        assertThatThrownBy(() -> extractor.extractBearerToken("   "))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.UNAUTHORIZED_EXCEPTION.getMessage());
    }

    @DisplayName("Authorization 헤더에서 Bearer 뒤에 토큰이 없으면 UNAUTHORIZED_EXCEPTION을 던진다.")
    @Test
    void extractBearerToken_fail_emptyToken() {
        assertThatThrownBy(() -> extractor.extractBearerToken("Bearer   "))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.UNAUTHORIZED_EXCEPTION.getMessage());
    }

    @DisplayName("Authorization 헤더가 Bearer 로 시작하지 않으면 UNAUTHORIZED_EXCEPTION을 던진다.")
    @Test
    void extractBearerToken_fail_notBearer() {
        assertThatThrownBy(() -> extractor.extractBearerToken("Basic abcdefg"))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.UNAUTHORIZED_EXCEPTION.getMessage());
    }
}

