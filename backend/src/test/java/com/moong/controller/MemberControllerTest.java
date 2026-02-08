package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Member;
import com.moong.dto.response.member.MemberInfoResponse;
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
}
