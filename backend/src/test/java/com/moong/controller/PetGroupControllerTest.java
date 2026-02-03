package com.moong.controller;

import static org.hamcrest.Matchers.equalTo;

import com.moong.domain.InviteCode;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.PetGroupParticipateRequest;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.util.InviteCodeGenerator;
import io.restassured.http.ContentType;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;

class PetGroupControllerTest extends BaseControllerTest {

    @Autowired
    private InviteCodeGenerator inviteCodeGenerator;

    @DisplayName("실패 : 회원이 2명 이상의 그룹에 참여해 있을 경우 그룹에 참여할 수 없다")
    @Test
    void participateFail_When_AlreadyParticipated() {
        Pet savedPet = petGenerator.generateSaved();
        Pet savedPet2 = petGenerator.generateSaved();
        Member geonwoo = memberGenerator.generateSaved("김건우");
        Member hyeonmin = memberGenerator.generateSaved("전현민");
        Member yeonjin = memberGenerator.generateSaved("주연진");
        PetGroup petGroup1 = petGroupGenerator.generateSaved(savedPet);
        PetGroup petGroup2 = petGroupGenerator.generateSaved(savedPet2);

        //그룹1 - 건우, 현민  | 그룹2 - 연진
        crewGenerator.generateSaveCrews(petGroup1, List.of(geonwoo, hyeonmin));
        crewGenerator.generateSaveCrews(petGroup2, List.of(yeonjin));
        InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup2.getId());
        PetGroupParticipateRequest request = new PetGroupParticipateRequest(
                InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode()
        );

        given().log().all()
                .contentType(ContentType.JSON)
                .body(request)
                .header(HttpHeaders.AUTHORIZATION, geonwoo.getId())
                .post("/api/group/participate")
                .then()
                .statusCode(400)
                .body("message", equalTo(ErrorCode.ALREADY_PARTICIPATE_ANOTHER_PET_GROUP.getMessage()));

    }

    @DisplayName("실패 : 펫 그룹 정원이 모두 찼을 때 그룹에 참여할 수 없다")
    @Test
    void participateFail_When_GroupIsFull() {
        Pet savedPet = petGenerator.generateSaved();
        Pet savedPet2 = petGenerator.generateSaved();
        Member guest = memberGenerator.generateSaved("게스트");
        Member geonwoo = memberGenerator.generateSaved("김건우");
        Member hyeonmin = memberGenerator.generateSaved("전현민");
        Member yeonjin = memberGenerator.generateSaved("주연진");
        Member jaemin = memberGenerator.generateSaved("강재민");
        Member bonsng = memberGenerator.generateSaved("구본승");
        Member yong = memberGenerator.generateSaved("권용현");
        PetGroup petGroup1 = petGroupGenerator.generateSaved(savedPet);
        PetGroup petGroup2 = petGroupGenerator.generateSaved(savedPet2);

        //그룹1 - 6명  | 그룹2 - Guest
        crewGenerator.generateSaveCrews(petGroup1, List.of(geonwoo, hyeonmin, yeonjin, jaemin, bonsng, yong));
        crewGenerator.generateSaveCrews(petGroup2, List.of(guest));
        InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup1.getId());
        PetGroupParticipateRequest request = new PetGroupParticipateRequest(
                InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode()
        );

        given().log().all()
                .contentType(ContentType.JSON)
                .body(request)
                .header(HttpHeaders.AUTHORIZATION, guest.getId())
                .post("/api/group/participate")
                .then()
                .statusCode(400)
                .body("message", equalTo(ErrorCode.PET_GROUP_IS_FULL.getMessage()));
    }

    @DisplayName("실패 : 이미 참여해 있을 때 펫 그룹에 참여할 수 없다")
    @Test
    void participateFail_When_AlreadyAttended() {
        Pet savedPet = petGenerator.generateSaved();
        Member guest = memberGenerator.generateSaved("게스트");
        PetGroup petGroup1 = petGroupGenerator.generateSaved(savedPet);
        crewGenerator.generateSaved(petGroup1, guest);
        InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup1.getId());
        PetGroupParticipateRequest request = new PetGroupParticipateRequest(
                InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode()
        );

        given().log().all()
                .contentType(ContentType.JSON)
                .body(request)
                .header(HttpHeaders.AUTHORIZATION, guest.getId())
                .post("/api/group/participate")
                .then()
                .statusCode(400)
                .body("message", equalTo(ErrorCode.ALREADY_ATTENDED_PET_GROUP.getMessage()));
    }

    @DisplayName("성공 : guest2 > guest1 펫 그룹에 참여할 수 있다")
    @Test
    void participateSuccess() {
        Pet savedPet = petGenerator.generateSaved();
        Pet savedPet2 = petGenerator.generateSaved();
        Member guest = memberGenerator.generateSaved("게스트");
        Member guest2 = memberGenerator.generateSaved("게스트");
        PetGroup petGroup1 = petGroupGenerator.generateSaved(savedPet);
        PetGroup petGroup2 = petGroupGenerator.generateSaved(savedPet2);
        crewGenerator.generateSaved(petGroup1, guest);
        crewGenerator.generateSaved(petGroup2, guest2);
        InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup1.getId());
        PetGroupParticipateRequest request = new PetGroupParticipateRequest(
                InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode()
        );

        given().log().all()
                .contentType(ContentType.JSON)
                .body(request)
                .header(HttpHeaders.AUTHORIZATION, guest2.getId())
                .post("/api/group/participate")
                .then()
                .statusCode(200);
    }
}
