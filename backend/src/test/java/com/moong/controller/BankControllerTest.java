package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Bank;
import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.bank.BankCreateRequest;
import com.moong.dto.response.bank.BankInfoResponse;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;

class BankControllerTest extends BaseControllerTest {

    @DisplayName("저금통 생성 성공")
    @Test
    void createBankSuccess() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);

        BankCreateRequest bankCreateRequest = new BankCreateRequest(150000L);

        given().log().all()
                .contentType(ContentType.JSON)
                .body(bankCreateRequest)
                .header(HttpHeaders.AUTHORIZATION, member.getId())
                .post("/api/group/bank")
                .then()
                .statusCode(200);
    }

    @DisplayName("저금통 정보 및 랭킹 정보 조회에 성공한다")
    @Test
    void findBankInfoSuccess() {
        Member member1 = memberGenerator.generateSaved("member1");
        Member member2 = memberGenerator.generateSaved("member2");
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Crew crew1 = crewGenerator.generateSaved(petGroup, member1);
        Crew crew2 = crewGenerator.generateSaved(petGroup, member2);
        Bank bank = groupBankGenerator.generateSaved(petGroup, 1000000L);
        Coin smallCoin = coinGenerator.generateSaved(bank, crew1, 100L);
        Coin bigCoin = coinGenerator.generateSaved(bank, crew2, 200L);

        BankInfoResponse bankInfo = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, member1.getId())
                .get("/api/group/bank")
                .then()
                .statusCode(200)
                .extract()
                .as(BankInfoResponse.class);

        assertAll(
                () -> assertThat(bankInfo.bankId()).isEqualTo(bank.getId()),
                () -> assertThat(bankInfo.target()).isEqualTo(bank.getTargetAmount()),
                () -> assertThat(bankInfo.current()).isEqualTo(bank.getCurrentAmount()),
                () -> assertThat(bankInfo.rankings()).hasSize(2),
                () -> assertThat(bankInfo.rankings().get(0).userName()).isEqualTo(member2.getName()),
                () -> assertThat(bankInfo.rankings().get(0).total()).isEqualTo(bigCoin.getAmount()),
                () -> assertThat(bankInfo.rankings().get(1).userName()).isEqualTo(member1.getName()),
                () -> assertThat(bankInfo.rankings().get(1).total()).isEqualTo(smallCoin.getAmount())
        );
    }

    @DisplayName("저금통 정보 및 랭킹 정보 조회 실패 : 저금통이 아직 없는 경우")
    @Test
    void findBankInfoFail() {
        Member member1 = memberGenerator.generateSaved("member1");
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        crewGenerator.generateSaved(petGroup, member1);

        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, member1.getId())
                .get("/api/group/bank")
                .then()
                .statusCode(404);
    }
}
