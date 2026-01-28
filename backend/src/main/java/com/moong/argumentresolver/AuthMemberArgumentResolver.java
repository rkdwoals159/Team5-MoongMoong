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
        long memberId = getMemberId(webRequest);
        return authService.authorize(memberId);
    }

    private long getMemberId(NativeWebRequest webRequest) {
        try {
            String memberId = webRequest.getHeader(HttpHeaders.AUTHORIZATION);
            return Long.parseLong(memberId);
        } catch (NumberFormatException exception) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_EXCEPTION);
        }
    }
}
