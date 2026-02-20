package com.moong.fixture;

import com.moong.domain.entity.Member;
import com.moong.dto.response.member.MemberInfoResponse;
import com.moong.repository.MemberRepository;
import com.moong.service.MemberService;
import java.security.SecureRandom;
import java.util.Random;
import org.springframework.stereotype.Component;

@Component
public class MemberGenerator {

    private final MemberRepository memberRepository;

    public MemberGenerator(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member generateSaved(String name) {
        Random random = new SecureRandom();
        String email = "email" + random.nextInt(1000) + "@email.com";
        Member member = new Member(email, name);
        return memberRepository.save(member);
    }
}
