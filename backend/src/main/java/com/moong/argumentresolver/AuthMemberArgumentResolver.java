package com.moong.argumentresolver;

import com.moong.annotation.auth.AuthMember;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Slf4j
@RequiredArgsConstructor
public class AuthMemberArgumentResolver implements HandlerMethodArgumentResolver {

    private static final String REQUEST_PARAMETER_MEMBER_ID = "memberId";
    private static final String REQUEST_PARAMETER_AUTH = "auth";

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
        String memberId = webRequest.getParameter(REQUEST_PARAMETER_MEMBER_ID);
        boolean shouldAuth = Boolean.parseBoolean(webRequest.getParameter(REQUEST_PARAMETER_AUTH));

        if (!shouldAuth) {
            return null;
        }

        if (shouldAuth && memberId == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_EXCEPTION);
        }
        return authService.authorize(Long.parseLong(memberId));
    }
}
