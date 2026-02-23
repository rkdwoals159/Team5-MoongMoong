package com.moong.controller.pet;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.PetControllerSwagger;
import com.moong.domain.member.Member;
import com.moong.dto.request.pet.PetCreateRequest;
import com.moong.dto.request.pet.PetUpdateRequest;
import com.moong.dto.response.pet.PetCreateResponse;
import com.moong.dto.response.pet.PetReadResponse;
import com.moong.dto.response.pet.PetUpdateResponse;
import com.moong.facade.petgroup.PetGroupFacadeService;
import com.moong.service.petgroup.PetGroupService;
import com.moong.service.pet.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PetController implements PetControllerSwagger {

    private final PetGroupFacadeService petGroupFacadeService;
    private final PetService petService;
    private final PetGroupService petGroupService;

    @Override
    @PostMapping(path = "/api/pet")
    public ResponseEntity<PetCreateResponse> savePet(
            @AuthMember Member member,
            @RequestBody @Valid PetCreateRequest petCreateRequest
    ) {
        PetCreateResponse response = petGroupFacadeService.firstJoin(member, petCreateRequest);
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping(path = "/api/pet")
    public ResponseEntity<PetReadResponse> findPetInfo(
            @AuthMember Member member
    ) {
        PetReadResponse response = petService.findPetInfo(member);
        return ResponseEntity.ok(response);
    }

    @Override
    @PutMapping(path = "/api/pet")
    public ResponseEntity<PetUpdateResponse> updatePetInfo(
            @AuthMember Member member,
            @RequestBody PetUpdateRequest request
    ) {
        PetUpdateResponse response = petService.updatePetInfo(member, request);
        return ResponseEntity.ok(response);
    }
}
