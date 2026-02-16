package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.PetControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.dto.request.PetCreateRequest;
import com.moong.dto.response.pet.PetCreateResponse;
import com.moong.dto.response.pet.PetReadResponse;
import com.moong.service.GroupService;
import com.moong.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PetController implements PetControllerSwagger {

    private final PetService petService;
    private final GroupService groupService;

    @Override
    @PostMapping(path = "/api/pet")
    public ResponseEntity<PetCreateResponse> savePet(
            @AuthMember Member member,
            @RequestBody @Valid PetCreateRequest petCreateRequest
    ) {
        //TODO Facade 고민
        PetCreateResponse response = petService.createPet(member, petCreateRequest);
        groupService.firstJoin(member, response.petId());
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
}
