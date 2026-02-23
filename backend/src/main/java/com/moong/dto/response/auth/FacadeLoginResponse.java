package com.moong.dto.response.auth;

import com.moong.domain.pet.Pet;
import com.moong.dto.response.member.MemberReadResponse;
import com.moong.dto.response.pet.InvitedPetResponse;
import java.time.Duration;

public record FacadeLoginResponse(
        boolean isInvited,
        boolean isNew,
        boolean hasGroup,
        long memberId,
        String name,
        String imageUrl,
        InvitedPetResponse invitedPetResponse,
        JwtTokenResponse tokenResponse
) {

    public static FacadeLoginResponse invitedMember(
            boolean hasGroup,
            MemberReadResponse memberReadResponse,
            Pet invitedPet,
            JwtTokenResponse jwtTokenResponse
    ) {
        return new FacadeLoginResponse(
                true,
                memberReadResponse.isNew(),
                hasGroup,
                memberReadResponse.member().getId(),
                memberReadResponse.member().getName(),
                memberReadResponse.member().getImageUrl(),
                new InvitedPetResponse(invitedPet),
                jwtTokenResponse
        );
    }

    public static FacadeLoginResponse nonInvitedMember(
            boolean hasGroup,
            MemberReadResponse memberReadResponse,
            JwtTokenResponse jwtTokenResponse
    ) {
        return new FacadeLoginResponse(
                false,
                memberReadResponse.isNew(),
                hasGroup,
                memberReadResponse.member().getId(),
                memberReadResponse.member().getName(),
                memberReadResponse.member().getImageUrl(),
                InvitedPetResponse.noneInvited(),
                jwtTokenResponse
        );
    }

    public String accessToken() {
        return tokenResponse.accessToken();
    }

    public String refreshToken() {
        return tokenResponse.refreshToken();
    }

    public Duration refreshTokenExpiration() {
        return tokenResponse.refreshTokenExpiration();
    }
}
