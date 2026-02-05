package com.moong.service;

import com.moong.domain.entity.Member;
import com.moong.domain.member.MemberInfo;
import com.moong.dto.response.member.MemberInfoResponse;
import com.moong.dto.response.member.MemberReadResponse;
import com.moong.repository.MemberRepository;
import com.moong.util.MemberNameGenerator;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final MemberNameGenerator memberNameGenerator;

    public MemberReadResponse findExistsMemberOrSave(MemberInfo memberInfo) {
        Optional<Member> foundMember = memberRepository.findByEmail(memberInfo.email());
        if (foundMember.isEmpty()) {
            Member freshMember = saveNewMember(memberInfo);
            return new MemberReadResponse(true, freshMember);
        }
        return new MemberReadResponse(false, foundMember.get());
    }

    private Member saveNewMember(MemberInfo memberInfo) {
        String memberName = memberNameGenerator.generateUniqueNameWithDecorator(memberRepository::existsByName);
        Member freshMember = new Member(memberInfo.email(), memberName, MemberInfoResponse.TEMP_MEMBER_IMAGE_URL);
        return memberRepository.save(freshMember);
    }
}
