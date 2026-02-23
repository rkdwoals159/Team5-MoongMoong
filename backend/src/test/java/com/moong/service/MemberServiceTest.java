package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.member.Member;
import com.moong.domain.member.MemberInfo;
import com.moong.dto.request.member.MemberUpdateNameRequest;
import com.moong.dto.request.member.MemberUpdateProfileRequest;
import com.moong.dto.response.member.MemberReadResponse;
import com.moong.dto.response.member.MemberUpdateNameResponse;
import com.moong.dto.response.member.MemberUpdateProfileResponse;
import com.moong.service.member.MemberService;
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

    @DisplayName("회원 프로필 이미지를 수정할 수 있다")
    @Test
    void updateProfile() {
        Member member = memberGenerator.generateSaved("멤버1");
        MemberUpdateProfileRequest request = new MemberUpdateProfileRequest("새로운이미지url");

        MemberUpdateProfileResponse response = memberService.updateProfile(member, request);

        assertAll(
                () -> assertThat(response.memberId()).isEqualTo(member.getId()),
                () -> assertThat(response.memberName()).isEqualTo(member.getName()),
                () -> assertThat(response.memberImageUrl()).isEqualTo(request.memberImageUrl())
        );
    }

    @DisplayName("회원 닉네임을 수정할 수 있다")
    @Test
    void updateName() {
        Member member = memberGenerator.generateSaved("멤버1");
        MemberUpdateNameRequest request = new MemberUpdateNameRequest("헬창재민");

        MemberUpdateNameResponse response = memberService.updateName(member, request);

        assertAll(
                () -> assertThat(response.memberId()).isEqualTo(member.getId()),
                () -> assertThat(response.memberName()).isEqualTo(request.memberName()),
                () -> assertThat(response.memberImageUrl()).isEqualTo(member.getImageUrl())
        );
    }
}
