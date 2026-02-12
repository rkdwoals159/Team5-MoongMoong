package com.moong.facade.auth;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.auth.AuthLoginRequest;
import com.moong.dto.request.auth.AuthTokenRefreshRequest;
import com.moong.dto.response.auth.AuthTokenRefreshResponse;
import com.moong.dto.response.auth.JwtTokenResponse;
import com.moong.dto.response.auth.MemberInfoWithTokenResponse;
import com.moong.dto.response.member.FacadeLoginResponse;
import com.moong.dto.response.member.MemberReadResponse;
import com.moong.service.AuthService;
import com.moong.service.GroupService;
import com.moong.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthFacadeService {

    private final MemberService memberService;
    private final GroupService groupService;
    private final AuthService authService;

    public FacadeLoginResponse login(AuthLoginRequest loginRequest) {
        boolean isInvited = loginRequest.hasInviteUrl();
        MemberInfoWithTokenResponse memberInfoWithToken = authService.findMemberInfoAndGenerateToken(
                loginRequest.accessToken());
        JwtTokenResponse jwtTokenResponse = memberInfoWithToken.jwtTokenResponse();
        MemberReadResponse foundMemberResponse = memberService.findExistsMemberOrSave(memberInfoWithToken.memberInfo());
        if (isInvited) {
            PetGroup petGroup = groupService.findFetchedPetGroupByInviteUrl(loginRequest.inviteUrl());
            return FacadeLoginResponse.invitedMember(foundMemberResponse, petGroup.getPet(), jwtTokenResponse);
        }
        return FacadeLoginResponse.nonInvitedMember(foundMemberResponse, jwtTokenResponse);
    }

    public JwtTokenResponse refreshToken(AuthTokenRefreshRequest refreshRequest) {
        return authService.refreshToken(refreshRequest.refreshToken());
    }

    public void logout(Member member, String refreshToken) {
        authService.logout(member, refreshToken);
    }
}
