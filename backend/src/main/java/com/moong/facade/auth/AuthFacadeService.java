package com.moong.facade.auth;

import com.moong.domain.member.Member;
import com.moong.domain.petgroup.PetGroup;
import com.moong.domain.member.MemberInfo;
import com.moong.dto.request.auth.AuthLoginRequest;
import com.moong.dto.request.auth.AuthTokenRefreshRequest;
import com.moong.dto.response.auth.ConnectionTokenResponse;
import com.moong.dto.response.auth.JwtTokenResponse;
import com.moong.dto.response.auth.MemberInfoWithTokenResponse;
import com.moong.dto.response.auth.FacadeLoginResponse;
import com.moong.dto.response.member.MemberReadResponse;
import com.moong.event.member.WelcomeMailEvent;
import com.moong.service.auth.AuthService;
import com.moong.service.crew.CrewService;
import com.moong.service.petgroup.PetGroupService;
import com.moong.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthFacadeService {

    private final MemberService memberService;
    private final PetGroupService petGroupService;
    private final AuthService authService;
    private final CrewService crewService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public FacadeLoginResponse login(AuthLoginRequest loginRequest) {
        boolean isInvited = loginRequest.hasInviteUrl();
        MemberInfoWithTokenResponse memberInfoWithToken = authService.findMemberInfoAndGenerateToken(
                loginRequest.accessToken()
        );
        JwtTokenResponse jwtTokenResponse = memberInfoWithToken.jwtTokenResponse();
        MemberReadResponse foundMemberResponse = memberService.findExistsMemberOrSave(memberInfoWithToken.memberInfo());
        boolean hasGroup = crewService.existsByMemberId(foundMemberResponse.member().getId());

        if (foundMemberResponse.isNew()) {
            eventPublisher.publishEvent(new WelcomeMailEvent(foundMemberResponse.member().getEmail()));
        }
        if (isInvited) {
            PetGroup petGroup = petGroupService.findFetchedPetGroupByInviteUrl(loginRequest.inviteUrl());
            return FacadeLoginResponse.invitedMember(hasGroup, foundMemberResponse, petGroup.getPet(), jwtTokenResponse);
        }
        return FacadeLoginResponse.nonInvitedMember(hasGroup, foundMemberResponse, jwtTokenResponse);
    }

    public ConnectionTokenResponse issueConnectionToken(Member member) {
        MemberInfo memberInfo = new MemberInfo(member.getEmail());
        return authService.issueConnectionToken(memberInfo);
    }

    public JwtTokenResponse refreshToken(AuthTokenRefreshRequest refreshRequest) {
        return authService.refreshToken(refreshRequest.refreshToken());
    }

    public void logout(Member member, String refreshToken) {
        authService.logout(member, refreshToken);
    }
}
