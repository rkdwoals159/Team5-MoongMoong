package com.moong.argumentresolver;

import com.moong.annotation.auth.AuthMember;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.service.auth.AuthService;
import com.moong.controller.tool.auth.AuthorizationHeaderExtractor;
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

    private final AuthService authService;
    private final AuthorizationHeaderExtractor authorizationHeaderExtractor;

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

        String accessToken = authorizationHeaderExtractor.extractBearerToken(rawAccessToken);
        return authService.authorizeByAccessToken(accessToken);
    }
}
