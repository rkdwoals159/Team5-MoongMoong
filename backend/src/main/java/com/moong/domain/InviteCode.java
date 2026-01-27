package com.moong.domain;

import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class InviteCode {

    public static final String HTTP_INVITE_URL_PREFIX = "https://moong.site/invite/";

    private final String code;

    public static InviteCode parseFromUrl(String url) {
        if(!url.startsWith(HTTP_INVITE_URL_PREFIX)) {
            throw new BusinessException(ErrorCode.INVALID_INVITE_CODE_URL);
        }
        return new InviteCode(url.substring(HTTP_INVITE_URL_PREFIX.length()));
    }
}
