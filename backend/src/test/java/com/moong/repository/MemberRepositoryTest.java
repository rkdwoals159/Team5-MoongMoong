package com.moong.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.member.Member;
import com.moong.repository.member.MemberRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class MemberRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    @DisplayName("회원 프로필 이미지를 수정할 수 있다")
    @Test
    void updateProfile() {
        String updateImageUrl = "새로운 이미지 url";
        Member member = memberGenerator.generateSaved("멤버1");

        memberRepository.updateProfile(member.getId(), updateImageUrl);

        Member updatedMember = memberRepository.getById(member.getId());
        assertThat(updatedMember.getImageUrl()).isEqualTo(updateImageUrl);
    }

    @DisplayName("회원 닉네임을 수정할 수 있다")
    @Test
    void updateName() {
        String updateName = "새로운 닉네임";
        Member member = memberGenerator.generateSaved("멤버1");

        memberRepository.updateMemberName(member.getId(), updateName);

        Member updatedMember = memberRepository.getById(member.getId());
        assertThat(updatedMember.getName()).isEqualTo(updateName);
    }
}
