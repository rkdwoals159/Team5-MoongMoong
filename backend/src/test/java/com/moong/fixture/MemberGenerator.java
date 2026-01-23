package com.moong.fixture;

import com.moong.domain.entity.Member;
import com.moong.repository.MemberRepository;
import org.springframework.stereotype.Component;

@Component
public class MemberGenerator {

    private final MemberRepository memberRepository;

    public MemberGenerator(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member generateSaved(String name) {
        Member member = new Member("email@email.com", name, "imagUrl");
        return memberRepository.save(member);
    }
}
