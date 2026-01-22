package com.moong.controller;

import com.moong.dto.request.PetCreateRequest;
import com.moong.dto.response.PetCreateResponse;
import com.moong.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @PostMapping(path = "/api/pet")
    public ResponseEntity<PetCreateResponse> savePet(@RequestBody PetCreateRequest petCreateRequest,
                                                     @RequestParam(value = "memberId") long memberId) {
        PetCreateResponse response = petService.createPet(petCreateRequest);
        return ResponseEntity.ok(response);
    }
}
