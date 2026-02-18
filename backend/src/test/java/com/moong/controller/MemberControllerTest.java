package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Member;
import com.moong.dto.request.member.MemberUpdateNameRequest;
import com.moong.dto.request.member.MemberUpdateProfileRequest;
import com.moong.dto.response.member.MemberInfoResponse;
import com.moong.dto.response.member.MemberUpdateNameResponse;
import com.moong.dto.response.member.MemberUpdateProfileResponse;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;

class MemberControllerTest extends BaseControllerTest {

    @DisplayName("회원 정보 반환 성공")
    @Test
    void findMemberInfoSuccess() {
        Member member = memberGenerator.generateSaved("멤버1");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);

        MemberInfoResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .get("/api/member")
                .then()
                .statusCode(200)
                .extract()
                .as(MemberInfoResponse.class);

        assertAll(
                () -> assertThat(response.memberName()).isEqualTo(member.getName()),
                () -> assertThat(response.memberEmail()).isEqualTo(member.getEmail()),
                () -> assertThat(response.memberImageUrl()).isEqualTo(member.getImageUrl())
        );
    }

    @DisplayName("인증 실패 시 회원 정보 반환 실패")
    @Test
    void findMemberInfoFail() {

        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION , "")
                .get("/api/member")
                .then()
                .statusCode(401);
    }

    @DisplayName("회원 닉네임을 수정할 수 있다")
    @Test
    void updateName() {
        Member member = memberGenerator.generateSaved("멤버1");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        MemberUpdateNameRequest request = new MemberUpdateNameRequest("헬창재민");

        MemberUpdateNameResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .body(request)
                .patch("/api/member/name")
                .then()
                .statusCode(200)
                .extract()
                .as(MemberUpdateNameResponse.class);

        assertAll(
                () -> assertThat(response.memberId()).isEqualTo(member.getId()),
                () -> assertThat(response.memberName()).isEqualTo(request.memberName()),
                () -> assertThat(response.memberImageUrl()).isEqualTo(member.getImageUrl())
        );
    }

    @DisplayName("회원 프로필 이미지를 수정할 수 있다")
    @Test
    void updateProfile() {
        Member member = memberGenerator.generateSaved("멤버1");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        MemberUpdateProfileRequest request = new MemberUpdateProfileRequest("새로운이미지url");

        MemberUpdateProfileResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .body(request)
                .patch("/api/member/profile")
                .then()
                .statusCode(200)
                .extract()
                .as(MemberUpdateProfileResponse.class);

        assertAll(
                () -> assertThat(response.memberId()).isEqualTo(member.getId()),
                () -> assertThat(response.memberName()).isEqualTo(member.getName()),
                () -> assertThat(response.memberImageUrl()).isEqualTo(request.memberImageUrl())
        );
    }
}
