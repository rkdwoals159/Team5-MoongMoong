package com.moong.fixture;

import com.moong.controller.tool.jwt.JwtManager;
import com.moong.domain.member.Member;
import com.moong.domain.member.MemberInfo;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenGenerator {

    private final JwtManager jwtManager;

    public JwtTokenGenerator(JwtManager jwtManager) {
        this.jwtManager = jwtManager;
    }

    public String generateAccessToken(Member member) {
        return jwtManager.createAccessToken(new MemberInfo(member.getEmail()));
    }

    public String generateRefreshToken(Member member) {
        return jwtManager.createRefreshToken(new MemberInfo(member.getEmail()));
    }

    public String generateConnectionToken(Member member) {
        return jwtManager.createConnectToken(new MemberInfo(member.getEmail()));
    }
}
