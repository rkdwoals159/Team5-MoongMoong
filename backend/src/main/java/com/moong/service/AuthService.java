package com.moong.service;

import com.moong.client.oauth.OAuthClient;
import com.moong.controller.tool.jwt.AuthManager;
import com.moong.domain.entity.Member;
import com.moong.domain.member.MemberInfo;
import com.moong.dto.response.auth.ConnectionTokenResponse;
import com.moong.dto.response.auth.JwtTokenResponse;
import com.moong.dto.response.auth.MemberInfoWithTokenResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final AuthManager authManager;
    private final OAuthClient oAuthClient;

    //TODO 프론트 코드 전환 후 삭제
    public Member authorize(long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED_EXCEPTION));
    }

    public Member authorizeByConnectionToken(String connectionToken) {
        String email = authManager.resolveConnectionToken(connectionToken);
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CONNECTION_TOKEN));
    }

    public Member authorizeByAccessToken(String accessToken) {
        String email = authManager.resolveAccessToken(accessToken);
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED_EXCEPTION));
    }

    public MemberInfoWithTokenResponse findMemberInfoAndGenerateToken(String accessToken) {
        MemberInfo memberInfo = oAuthClient.requestMemberInfo(accessToken);
        JwtTokenResponse jwtTokenResponse = authManager.issueToken(memberInfo);
        return new MemberInfoWithTokenResponse(memberInfo, jwtTokenResponse);
    }

    public ConnectionTokenResponse issueConnectionToken(MemberInfo memberInfo) {
        return authManager.issueConnectionToken(memberInfo);
    }

    public JwtTokenResponse refreshToken(String refreshToken) {
        return authManager.reissueToken(refreshToken);
    }

    public void logout(Member member, String refreshToken) {
        String email = authManager.resolveRefreshToken(refreshToken);
        if (!member.isSame(email)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_EXCEPTION);
        }
    }
}
