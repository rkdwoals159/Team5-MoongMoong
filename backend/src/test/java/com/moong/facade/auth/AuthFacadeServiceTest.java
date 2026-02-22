package com.moong.facade.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.ArgumentMatchers.anyString;

import com.moong.controller.tool.jwt.JwtManager;
import com.moong.domain.InviteCode;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.member.MemberInfo;
import com.moong.dto.PaymentFailedEvent;
import com.moong.dto.request.auth.AuthLoginRequest;
import com.moong.dto.response.auth.JwtTokenResponse;
import com.moong.dto.response.member.FacadeLoginResponse;
import com.moong.dto.response.pet.InvitedPetResponse;
import com.moong.event.member.WelcomeMailEvent;
import com.moong.service.BaseServiceTest;
import com.moong.util.InviteCodeGenerator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.event.ApplicationEvents;
import org.springframework.test.context.event.RecordApplicationEvents;

@RecordApplicationEvents
class AuthFacadeServiceTest extends BaseServiceTest {

    @Autowired
    private AuthFacadeService authFacadeService;

    @Autowired
    private InviteCodeGenerator inviteCodeGenerator;

    @Autowired
    private JwtManager jwtManager;

    @Autowired
    private ApplicationEvents applicationEvents;

    @Nested
    class Login {

        @DisplayName("신규유저 + 미초대 인원 : 회원 가입 후 반환")
        @Test
        void freshMember_NonInvitedMember() {
            AuthLoginRequest freshNonInvitedUser = new AuthLoginRequest("accessToken", null);

            FacadeLoginResponse loginResponse = authFacadeService.login(freshNonInvitedUser);

            assertAll(
                    () -> assertThat(loginResponse.isInvited()).isFalse(),
                    () -> assertThat(loginResponse.isNew()).isTrue(),
                    () -> assertThat(loginResponse.invitedPetResponse())
                            .usingRecursiveComparison()
                            .isEqualTo(InvitedPetResponse.noneInvited())
            );
        }

        @DisplayName("신규유저 + 초대 인원 : 회원 가입 및 초대된 펫그룹 정보 반환")
        @Test
        void freshMember_InvitedMember() {
            Pet pet = petGenerator.generateSaved();
            PetGroup petGroup = petGroupGenerator.generateSaved(pet);
            InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup.getId());
            AuthLoginRequest request = new AuthLoginRequest(
                    "accessToken",
                    InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode()
            );

            FacadeLoginResponse loginResponse = authFacadeService.login(request);
            InvitedPetResponse invitedPetResponse = loginResponse.invitedPetResponse();

            assertAll(
                    () -> assertThat(loginResponse.isInvited()).isTrue(),
                    () -> assertThat(loginResponse.isNew()).isTrue(),
                    () -> assertThat(invitedPetResponse.petName()).isEqualTo(pet.getName()),
                    () -> assertThat(invitedPetResponse.birthDate().getYear()).isEqualTo(pet.getBirthDate().getYear()),
                    () -> assertThat(invitedPetResponse.birthDate().getMonthValue()).isEqualTo(
                            pet.getBirthDate().getMonthValue()),
                    () -> assertThat(invitedPetResponse.gender()).isEqualTo(pet.getGender()),
                    () -> assertThat(invitedPetResponse.breed()).isEqualTo(pet.getBreed())
            );
        }

        @DisplayName("기존유저 + 미초대 인원 : 로그인 정보만")
        @Test
        void existsMember_NonInvitedMember() {
            Member member = memberGenerator.generateSaved("김건우");
            Pet pet = petGenerator.generateSaved();
            PetGroup petGroup = petGroupGenerator.generateSaved(pet);
            Crew crew = crewGenerator.generateSaved(petGroup, member);
            //기존 회원의 정보를 반환하도록 모킹
            Mockito.when(oAuthClient.requestMemberInfo(anyString()))
                    .thenReturn(new MemberInfo(member.getEmail()));
            AuthLoginRequest request = new AuthLoginRequest("accessToken", null);

            FacadeLoginResponse loginResponse = authFacadeService.login(request);
            JwtTokenResponse tokens = loginResponse.tokenResponse();

            assertAll(
                    () -> assertThat(loginResponse.isInvited()).isFalse(),
                    () -> assertThat(loginResponse.isNew()).isFalse(),
                    () -> assertThat(loginResponse.invitedPetResponse())
                            .usingRecursiveComparison()
                            .isEqualTo(InvitedPetResponse.noneInvited()),
                    () -> assertThat(loginResponse.memberId()).isEqualTo(member.getId()),
                    () -> assertThat(loginResponse.name()).isEqualTo(member.getName()),
                    () -> assertThat(jwtManager.resolveAccessToken(tokens.accessToken())).isEqualTo(member.getEmail()),
                    () -> assertThat(jwtManager.resolveRefreshToken(tokens.refreshToken())).isEqualTo(member.getEmail())
            );
        }

        @DisplayName("기존유저 + 초대 인원 : 로그인 정보 및 초대된 펫그룹 정보 반환")
        @Test
        void existsMember_InvitedMember() {
            Member member = memberGenerator.generateSaved("김건우");
            Pet pet = petGenerator.generateSaved();
            PetGroup petGroup = petGroupGenerator.generateSaved(pet);
            //기존 회원의 정보를 반환하도록 모킹
            Mockito.when(oAuthClient.requestMemberInfo(anyString()))
                    .thenReturn(new MemberInfo(member.getEmail()));
            InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup.getId());
            AuthLoginRequest request = new AuthLoginRequest(
                    "accessToken",
                    InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode()
            );

            FacadeLoginResponse loginResponse = authFacadeService.login(request);
            InvitedPetResponse invitedPetResponse = loginResponse.invitedPetResponse();
            JwtTokenResponse tokens = loginResponse.tokenResponse();

            assertAll(
                    () -> assertThat(loginResponse.isInvited()).isTrue(),
                    () -> assertThat(loginResponse.isNew()).isFalse(),
                    () -> assertThat(loginResponse.memberId()).isEqualTo(member.getId()),
                    () -> assertThat(loginResponse.name()).isEqualTo(member.getName()),
                    () -> assertThat(invitedPetResponse.petName()).isEqualTo(pet.getName()),
                    () -> assertThat(invitedPetResponse.birthDate().getYear())
                            .isEqualTo(pet.getBirthDate().getYear()),
                    () -> assertThat(invitedPetResponse.birthDate().getMonthValue())
                            .isEqualTo(pet.getBirthDate().getMonthValue()),
                    () -> assertThat(invitedPetResponse.gender()).isEqualTo(pet.getGender()),
                    () -> assertThat(invitedPetResponse.breed()).isEqualTo(pet.getBreed()),
                    () -> assertThat(jwtManager.resolveAccessToken(tokens.accessToken())).isEqualTo(member.getEmail()),
                    () -> assertThat(jwtManager.resolveRefreshToken(tokens.refreshToken())).isEqualTo(member.getEmail())
            );
        }

        @DisplayName("기존유저 + 그룹 미소속 인원")
        @Test
        void existsMember_NotGroupMember() {
            Member member = memberGenerator.generateSaved("김건우");
            Pet pet = petGenerator.generateSaved();
            PetGroup petGroup = petGroupGenerator.generateSaved(pet);
            //기존 회원의 정보를 반환하도록 모킹
            Mockito.when(oAuthClient.requestMemberInfo(anyString()))
                    .thenReturn(new MemberInfo(member.getEmail()));
            AuthLoginRequest request = new AuthLoginRequest("accessToken", null);

            FacadeLoginResponse loginResponse = authFacadeService.login(request);
            JwtTokenResponse tokens = loginResponse.tokenResponse();

            assertThat(loginResponse.hasGroup()).isFalse();
        }
    }

    @Nested
    class SendWelcomeEmail {

        @DisplayName("신규유저 + 미초대 인원 : 환영 이메일 발송")
        @Test
        void freshMember_NonInvitedMember() {
            AuthLoginRequest freshNonInvitedUser = new AuthLoginRequest("accessToken", null);

            authFacadeService.login(freshNonInvitedUser);

            assertThat(applicationEvents.stream(WelcomeMailEvent.class))
                    .hasSize(1);
        }

        @DisplayName("신규유저 + 초대 인원 : 환영 이메일 발송")
        @Test
        void freshMember_InvitedMember() {
            Pet pet = petGenerator.generateSaved();
            PetGroup petGroup = petGroupGenerator.generateSaved(pet);
            InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup.getId());
            AuthLoginRequest request = new AuthLoginRequest(
                    "accessToken",
                    InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode()
            );

            authFacadeService.login(request);

            assertThat(applicationEvents.stream(WelcomeMailEvent.class))
                    .hasSize(1);
        }
    }
}
