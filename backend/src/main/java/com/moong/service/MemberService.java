package com.moong.service;

import com.moong.domain.entity.Member;
import com.moong.domain.member.MemberInfo;
import com.moong.domain.member.MemberName;
import com.moong.dto.request.member.MemberUpdateNameRequest;
import com.moong.dto.request.member.MemberUpdateProfileRequest;
import com.moong.dto.response.member.MemberInfoResponse;
import com.moong.dto.response.member.MemberReadResponse;
import com.moong.dto.response.member.MemberUpdateNameResponse;
import com.moong.dto.response.member.MemberUpdateProfileResponse;
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
        MemberName memberName = memberNameGenerator.generateUniqueNameWithDecorator(memberRepository::existsByName);
        Member freshMember = new Member(memberInfo.email(), memberName.getValue(), MemberInfoResponse.TEMP_MEMBER_IMAGE_URL);
        return memberRepository.save(freshMember);
    }

    public MemberUpdateNameResponse updateName(Member member, MemberUpdateNameRequest request) {
        MemberName updateName = request.toName();
        memberRepository.updateMemberName(member.getId(), updateName.getValue());
        Member updatedMember = memberRepository.getById(member.getId());
        return new MemberUpdateNameResponse(updatedMember);
    }

    public MemberUpdateProfileResponse updateProfile(Member member, MemberUpdateProfileRequest request) {
        memberRepository.updateProfile(member.getId(), request.memberImageUrl());
        Member updatedMember = memberRepository.getById(member.getId());
        return new MemberUpdateProfileResponse(updatedMember);
    }
}
