package com.moong.util;

import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class AuthorizationHeaderExtractor {

    private static final String BEARER_PREFIX = "Bearer ";

    public String extractBearerToken(String authorization) {
        if (authorization == null || !authorization.startsWith(BEARER_PREFIX)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_EXCEPTION);
        }

        String token = authorization.substring(BEARER_PREFIX.length()).trim();

        if (token.isEmpty()) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_EXCEPTION);
        }

        return token;
    }
}

