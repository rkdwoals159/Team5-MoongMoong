package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.petgroup.InviteCode;
import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.domain.pet.Pet;
import com.moong.domain.petgroup.PetGroup;
import com.moong.dto.request.petgroup.PetGroupParticipateRequest;
import com.moong.dto.response.petgroup.GroupCrewResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.crew.CrewRepository;
import com.moong.repository.petgroup.PetGroupRepository;
import com.moong.service.petgroup.PetGroupService;
import com.moong.util.generator.InviteCodeGenerator;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class PetGroupServiceTest extends BaseServiceTest {

    @Autowired
    private PetGroupService petGroupService;

    @Autowired
    private PetGroupRepository petGroupRepository;

    @Autowired
    private CrewRepository crewRepository;

    @Autowired
    private InviteCodeGenerator inviteCodeGenerator;

    @DisplayName("첫 회원가입시 개인이 혼자 존재하는 그룹을 만든다")
    @Test
    void firstJoin() {
        Pet savedPet = petGenerator.generateSaved();
        Member member = memberGenerator.generateSaved("coli");

        PetGroup petGroup = petGroupService.firstJoin(member, savedPet.getId());

        Optional<PetGroup> foundPetGroup = petGroupRepository.findById(petGroup.getId());
        Optional<Crew> foundCrew = crewRepository.findByMemberId(member.getId());
        assertAll(
                () -> assertThat(foundPetGroup).isPresent(),
                () -> assertThat(foundCrew).isPresent()
        );
    }

    @Nested
    class Participate {

        @DisplayName("실패 : 회원이 2명 이상의 그룹에 참여해 있을 경우 그룹에 참여할 수 없다")
        @Test
        void participateFail_When_AlreadyParticipated() {
            Pet savedPet = petGenerator.generateSaved();
            Pet savedPet2 = petGenerator.generateSaved();
            Member geonwoo = memberGenerator.generateSaved("김건우");
            Member hyeonmin = memberGenerator.generateSaved("전현민");
            Member yeonjin = memberGenerator.generateSaved("주연진");
            PetGroup petGroup1 = petGroupGenerator.generateSaved(savedPet);
            PetGroup petGroup2 = petGroupGenerator.generateSaved(savedPet2);

            //그룹1 - 건우, 현민  | 그룹2 - 연진
            crewGenerator.generateSaveCrews(petGroup1, List.of(geonwoo, hyeonmin));
            crewGenerator.generateSaveCrews(petGroup2, List.of(yeonjin));
            InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup2.getId());

            assertThatThrownBy(() ->
                    petGroupService.participate(
                            hyeonmin,
                            new PetGroupParticipateRequest(InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode())
                    )
            ).isInstanceOf(BusinessException.class)
                    .hasMessage(ErrorCode.ALREADY_PARTICIPATE_ANOTHER_PET_GROUP.getMessage());
        }

        @DisplayName("성공 : 신규회원이 초대코드로 모임에 참여할 수 있다")
        @Test
        void participateSuccess_When_FreshMan() {
            Pet savedPet = petGenerator.generateSaved();
            Member geonwoo = memberGenerator.generateSaved("김건우");
            Member hyeonmin = memberGenerator.generateSaved("전현민");
            PetGroup petGroup1 = petGroupGenerator.generateSaved(savedPet);

            crewGenerator.generateSaved(petGroup1, geonwoo);
            InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup1.getId());

            assertThatCode(() ->
                    petGroupService.participate(
                            hyeonmin,
                            new PetGroupParticipateRequest(InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode())
                    )
            ).doesNotThrowAnyException();
        }

        @DisplayName("실패 : 펫 그룹 정원이 모두 찼을 때 그룹에 참여할 수 없다")
        @Test
        void participateFail_When_GroupIsFull() {
            Pet savedPet = petGenerator.generateSaved();
            Pet savedPet2 = petGenerator.generateSaved();
            Member guest = memberGenerator.generateSaved("게스트");
            Member geonwoo = memberGenerator.generateSaved("김건우");
            Member hyeonmin = memberGenerator.generateSaved("전현민");
            Member yeonjin = memberGenerator.generateSaved("주연진");
            Member jaemin = memberGenerator.generateSaved("강재민");
            Member bonsng = memberGenerator.generateSaved("구본승");
            Member yong = memberGenerator.generateSaved("권용현");
            PetGroup petGroup1 = petGroupGenerator.generateSaved(savedPet);
            PetGroup petGroup2 = petGroupGenerator.generateSaved(savedPet2);

            //그룹1 - 6명  | 그룹2 - Guest
            crewGenerator.generateSaveCrews(petGroup1, List.of(geonwoo, hyeonmin, yeonjin, jaemin, bonsng, yong));
            crewGenerator.generateSaveCrews(petGroup2, List.of(guest));
            InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup1.getId());

            assertThatThrownBy(() ->
                    petGroupService.participate(
                            guest,
                            new PetGroupParticipateRequest(InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode())
                    )
            ).isInstanceOf(BusinessException.class)
                    .hasMessage(ErrorCode.PET_GROUP_IS_FULL.getMessage());
        }

        @DisplayName("실패 : 이미 참여해 있을 때 펫 그룹에 참여할 수 없다")
        @Test
        void participateFail_When_AlreadyAttended() {
            Pet savedPet = petGenerator.generateSaved();
            Member guest = memberGenerator.generateSaved("게스트");
            PetGroup petGroup1 = petGroupGenerator.generateSaved(savedPet);
            crewGenerator.generateSaved(petGroup1, guest);
            InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup1.getId());

            assertThatThrownBy(() ->
                    petGroupService.participate(
                            guest,
                            new PetGroupParticipateRequest(InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode())
                    )
            ).isInstanceOf(BusinessException.class)
                    .hasMessage(ErrorCode.ALREADY_ATTENDED_PET_GROUP.getMessage());
        }

        @Disabled
        @DisplayName("동시성 이슈 테스트 : 같은 회원이 동시 참여를 시도할 때 한명의 회원만 참여가 성공한다")
        @Test
        void canHandleConcurrencyTest() throws InterruptedException {
            Pet savedPet = petGenerator.generateSaved();
            Pet savedPet2 = petGenerator.generateSaved();
            Member guest = memberGenerator.generateSaved("게스트");
            Member guest2 = memberGenerator.generateSaved("게스트2");
            PetGroup petGroup1 = petGroupGenerator.generateSaved(savedPet);
            PetGroup petGroup2 = petGroupGenerator.generateSaved(savedPet2);
            crewGenerator.generateSaved(petGroup1, guest);
            crewGenerator.generateSaved(petGroup2, guest2);
            InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup1.getId());

            runAtSameTime(2, () -> {
                try {
                    petGroupService.participate(
                            guest2,
                            new PetGroupParticipateRequest(InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode())
                    );
                } catch (Exception e) {
                }
            });

            List<Crew> crews = crewRepository.findAllByPetGroup_Id(petGroup1.getId());

            assertThat(crews)
                    .hasSize(2)
                    .extracting(crew -> crew.getMember().getId())
                    .containsExactly(guest.getId(), guest2.getId());
        }

        @DisplayName("성공 : guest2 > guest1 펫 그룹에 참여할 수 있다")
        @Test
        void participateSuccess() {
            Pet savedPet = petGenerator.generateSaved();
            Pet savedPet2 = petGenerator.generateSaved();
            Member guest = memberGenerator.generateSaved("게스트");
            Member guest2 = memberGenerator.generateSaved("게스트");
            PetGroup petGroup1 = petGroupGenerator.generateSaved(savedPet);
            PetGroup petGroup2 = petGroupGenerator.generateSaved(savedPet2);
            crewGenerator.generateSaved(petGroup1, guest);
            crewGenerator.generateSaved(petGroup2, guest2);
            InviteCode inviteCode = inviteCodeGenerator.encrypt(petGroup1.getId());

            assertThatCode(() ->
                    petGroupService.participate(
                            guest2,
                            new PetGroupParticipateRequest(InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode())
                    )
            ).doesNotThrowAnyException();
        }
    }

    @DisplayName("초대코드에 해당하는 펫 그룹을 찾을 수 있다.")
    @Test
    void findFetchedPetGroup() {
        Pet savedPet = petGenerator.generateSaved();
        PetGroup savedPetGroup = petGroupGenerator.generateSaved(savedPet);
        InviteCode inviteCode = inviteCodeGenerator.encrypt(savedPetGroup.getId());

        PetGroup petGroup = petGroupService.findFetchedPetGroupByInviteUrl(
                InviteCode.HTTP_INVITE_URL_PREFIX + inviteCode.getCode()
        );

        assertAll(
                () -> assertThat(petGroup.getId()).isEqualTo(savedPetGroup.getId()),
                () -> assertThat(petGroup.getPet().getId()).isEqualTo(savedPet.getId()),
                () -> assertThat(petGroup.getPet().getName()).isEqualTo(savedPet.getName()),
                () -> assertThat(petGroup.getPet().getBirthDate()).isEqualTo(savedPet.getBirthDate()),
                () -> assertThat(petGroup.getPet().getBreed()).isEqualTo(savedPet.getBreed()),
                () -> assertThat(petGroup.getPet().getGender()).isEqualTo(savedPet.getGender())
        );
    }

    @DisplayName("그룹에 해당하는 모임원 정보를 반환한다")
    @Test
    void getCrews() {
        Pet savedPet = petGenerator.generateSaved();
        Member geonwoo = memberGenerator.generateSaved("김건우");
        Member hyeonmin = memberGenerator.generateSaved("전현민");
        Member yeonjin = memberGenerator.generateSaved("주연진");
        PetGroup petGroup1 = petGroupGenerator.generateSaved(savedPet);
        crewGenerator.generateSaveCrews(petGroup1, List.of(geonwoo, hyeonmin, yeonjin));

        GroupCrewResponse response = petGroupService.getCrews(geonwoo);

        assertAll(
                () -> assertThat(response.memberName()).isEqualTo(geonwoo.getName()),
                () -> assertThat(inviteCodeGenerator.decode(InviteCode.parseFromUrl(response.inviteUrl())))
                        .isEqualTo(petGroup1.getId()),
                () -> assertThat(response.crews())
                        .containsExactly(hyeonmin.getName(), yeonjin.getName())
        );
    }
}
