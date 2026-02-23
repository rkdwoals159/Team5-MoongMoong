package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.ArgumentMatchers.anyString;

import com.moong.domain.petgroup.InviteCode;
import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.domain.pet.Pet;
import com.moong.domain.petgroup.PetGroup;
import com.moong.domain.member.MemberInfo;
import com.moong.dto.request.auth.AuthLoginRequest;
import com.moong.dto.request.auth.AuthTokenRefreshRequest;
import com.moong.dto.response.auth.AuthLoginResponse;
import com.moong.util.generator.InviteCodeGenerator;
import io.restassured.http.ContentType;
import org.apache.http.HttpHeaders;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;

class AuthControllerTest extends BaseControllerTest {

    @Autowired
    private InviteCodeGenerator inviteCodeGenerator;


    @Nested
    class Login {

        @DisplayName("신규유저 + 미초대 인원 : 회원 가입 후 반환")
        @Test
        void freshMember_NonInvitedMember() {
            AuthLoginRequest freshNonInvitedUser = new AuthLoginRequest("accessToken", null);

            AuthLoginResponse response = given().log().all()
                    .contentType(ContentType.JSON)
                    .body(freshNonInvitedUser)
                    .post("/api/auth/login")
                    .then()
                    .statusCode(200)
                    .extract()
                    .as(AuthLoginResponse.class);

            assertAll(
                    () -> assertThat(response.isInvited()).isFalse(),
                    () -> assertThat(response.isNew()).isTrue(),
                    () -> assertThat(response.breed()).isNull(),
                    () -> assertThat(response.gender()).isNull(),
                    () -> assertThat(response.birthDate()).isNull(),
                    () -> assertThat(response.petName()).isNull()
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

            AuthLoginResponse response = given().log().all()
                    .contentType(ContentType.JSON)
                    .body(request)
                    .post("/api/auth/login")
                    .then()
                    .statusCode(200)
                    .extract()
                    .as(AuthLoginResponse.class);

            assertAll(
                    () -> assertThat(response.isInvited()).isTrue(),
                    () -> assertThat(response.isNew()).isTrue(),
                    () -> assertThat(response.petName()).isEqualTo(pet.getName()),
                    () -> assertThat(response.birthDate().getYear())
                            .isEqualTo(pet.getBirthDate().getYear()),
                    () -> assertThat(response.birthDate().getMonthValue())
                            .isEqualTo(pet.getBirthDate().getMonthValue()),
                    () -> assertThat(response.gender()).isEqualTo(pet.getGender()),
                    () -> assertThat(response.breed()).isEqualTo(pet.getBreed())
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

            AuthLoginResponse response = given().log().all()
                    .contentType(ContentType.JSON)
                    .body(request)
                    .post("/api/auth/login")
                    .then()
                    .statusCode(200)
                    .extract()
                    .as(AuthLoginResponse.class);

            assertAll(
                    () -> assertThat(response.isInvited()).isFalse(),
                    () -> assertThat(response.isNew()).isFalse(),
                    () -> assertThat(response.memberId()).isEqualTo(member.getId()),
                    () -> assertThat(response.name()).isEqualTo(member.getName())
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

            AuthLoginResponse response = given().log().all()
                    .contentType(ContentType.JSON)
                    .body(request)
                    .post("/api/auth/login")
                    .then()
                    .statusCode(200)
                    .extract()
                    .as(AuthLoginResponse.class);

            assertAll(
                    () -> assertThat(response.isInvited()).isTrue(),
                    () -> assertThat(response.isNew()).isFalse(),
                    () -> assertThat(response.memberId()).isEqualTo(member.getId()),
                    () -> assertThat(response.name()).isEqualTo(member.getName()),
                    () -> assertThat(response.petName()).isEqualTo(pet.getName()),
                    () -> assertThat(response.birthDate().getYear())
                            .isEqualTo(pet.getBirthDate().getYear()),
                    () -> assertThat(response.birthDate().getMonthValue())
                            .isEqualTo(pet.getBirthDate().getMonthValue()),
                    () -> assertThat(response.gender()).isEqualTo(pet.getGender()),
                    () -> assertThat(response.breed()).isEqualTo(pet.getBreed())
            );
        }
    }

    @Nested
    class Logout {

        @DisplayName("로그아웃 할 수 있다")
        @Test
        void logoutSuccess() {
            Member member = memberGenerator.generateSaved("김건우");
            String accessToken = jwtTokenGenerator.generateAccessToken(member);
            String refreshToken = jwtTokenGenerator.generateRefreshToken(member);

            given().log().all()
                    .contentType(ContentType.JSON)
                    .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                    .cookie("refreshToken", refreshToken)
                    .post("/api/auth/logout")
                    .then()
                    .statusCode(200);
        }

        @DisplayName("회원이 일치하지 않으면 로그아웃 할 수 없다")
        @Test
        void logoutFailure() {
            Member member = memberGenerator.generateSaved("김건우1");
            Member member2 = memberGenerator.generateSaved("김건우2");
            String accessToken = jwtTokenGenerator.generateAccessToken(member);
            String refreshToken = jwtTokenGenerator.generateRefreshToken(member2);

            given().log().all()
                    .contentType(ContentType.JSON)
                    .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                    .cookie("refreshToken", refreshToken)
                    .post("/api/auth/logout")
                    .then()
                    .statusCode(401);
        }
    }

    @Nested
    class RefreshToken {

        @DisplayName("토큰을 재발급 받을 수 있다")
        @Test
        void refreshSuccess() {
            Member member = memberGenerator.generateSaved("김건우");
            String accessToken = jwtTokenGenerator.generateAccessToken(member);
            String refreshToken = jwtTokenGenerator.generateRefreshToken(member);
            AuthTokenRefreshRequest request = new AuthTokenRefreshRequest(accessToken, refreshToken);

            given().log().all()
                    .contentType(ContentType.JSON)
                    .body(request)
                    .post("/api/auth/refresh")
                    .then()
                    .statusCode(200);
        }
    }

    @Nested
    class ConnectionToken {

        @DisplayName("Connection 토큰을 발급 받을 수 있다")
        @Test
        void issueSuccess() {
            Member member = memberGenerator.generateSaved("테스트");
            String accessToken = jwtTokenGenerator.generateAccessToken(member);

            given().log().all()
                    .contentType(ContentType.JSON)
                    .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                    .post("/api/auth/sse-token")
                    .then()
                    .statusCode(200);
        }

        @DisplayName("Connection 토큰 발행 실패- 인증 오류")
        @Test
        void refreshSuccess() {
            given().log().all()
                    .contentType(ContentType.JSON)
                    .post("/api/auth/sse-token")
                    .then()
                    .statusCode(401);
        }
    }

    @Nested
    class Validate {

        @DisplayName("유효한 엑세스 토큰의 유효성을 검증할 수 있다")
        @Test
        void validateSuccess() {
            Member member = memberGenerator.generateSaved("김건우");
            String accessToken = jwtTokenGenerator.generateAccessToken(member);

            given().log().all()
                    .contentType(ContentType.JSON)
                    .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                    .get("/api/auth/validate")
                    .then()
                    .statusCode(200);
        }

        @DisplayName("유효하지 않은 엑세스 토큰의 유효성을 검증할 수 있다")
        @Test
        void validateFailure() {
            Member member = memberGenerator.generateSaved("김건우");

            given().log().all()
                    .contentType(ContentType.JSON)
                    .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + "accessToken")
                    .get("/api/auth/validate")
                    .then()
                    .statusCode(401);
        }
    }
}
