package com.moong.dto.response.petgroup;

import com.moong.domain.petgroup.InviteCode;
import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "모임원 정보 조회 응답")
public record GroupCrewResponse(

        @Schema(description = "요청한 사용자 이름", example = "김건우")
        String memberName,

        @Schema(description = "초대 URL", example = "https://moong.site/invite/ABCD1234")
        String inviteUrl,

        @Schema(description = "모임원 닉네임 목록", example = "[\"두john쿠\", \"용용이\", \"헬창재민\"]")
        List<String> crews
) {

    public GroupCrewResponse(Member member, InviteCode inviteCode, List<Crew> crews) {
        this(
                member.getName(),
                InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode(),
                crews.stream()
                        .map(crew -> crew.getMember().getName())
                        .toList()
        );
    }
}
