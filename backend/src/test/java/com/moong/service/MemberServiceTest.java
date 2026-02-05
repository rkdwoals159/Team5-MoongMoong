package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Member;
import com.moong.domain.member.MemberInfo;
import com.moong.dto.response.member.MemberReadResponse;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class MemberServiceTest extends BaseServiceTest {

    @Autowired
    private MemberService memberService;

    @DisplayName("같은 정보를 가지는 기존회원이 있다면 기존회원을 반환한다")
    @Test
    void findExistsMember() {
        Member savedMember = memberGenerator.generateSaved("김건우");
        MemberInfo existsMemberInfo = new MemberInfo(savedMember.getEmail());

        MemberReadResponse foundMember = memberService.findExistsMemberOrSave(existsMemberInfo);

        assertAll(
                () -> assertThat(foundMember.isNew()).isFalse(),
                () -> assertThat(foundMember.member().getId()).isEqualTo(savedMember.getId()),
                () -> assertThat(foundMember.member().getEmail()).isEqualTo(savedMember.getEmail()),
                () -> assertThat(foundMember.member().getImageUrl()).isEqualTo(savedMember.getImageUrl())
        );
    }

    @DisplayName("같은 정보를 가지는 기존회원이 없다면 회원을 저장하고 반환한다")
    @Test
    void saveFreshMember() {
        MemberInfo nonExistsMemberInfo = new MemberInfo(UUID.randomUUID().toString());

        MemberReadResponse foundMember = memberService.findExistsMemberOrSave(nonExistsMemberInfo);

        assertThat(foundMember.isNew()).isTrue();
    }
}
