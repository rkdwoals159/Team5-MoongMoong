package com.moong.argumentresolver;

import com.moong.annotation.auth.AuthMember;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Slf4j
@RequiredArgsConstructor
public class AuthMemberArgumentResolver implements HandlerMethodArgumentResolver {

    private static final String BEARER_PREFIX = "Bearer ";

    private final AuthService authService;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(AuthMember.class);
    }

    @Override
    public Object resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory
    ) {
        String rawAccessToken = webRequest.getHeader(HttpHeaders.AUTHORIZATION);

        if(rawAccessToken == null || rawAccessToken.isBlank()) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_EXCEPTION);
        }
        //TODO 프론트 코드 전환 후 삭제
        if (rawAccessToken.equals("1") || rawAccessToken.equals("2")) {
            return authService.authorize(Long.parseLong(rawAccessToken));
        }

        if(rawAccessToken.length() < BEARER_PREFIX.length()) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_EXCEPTION);
        }
        String accessToken = rawAccessToken.substring(BEARER_PREFIX.length());
        return authService.authorizeByAccessToken(accessToken);
    }
}
