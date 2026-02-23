package com.moong.domain.member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    private static final String MEMBER_DEFAULT_IMAGE_URL = "https://u99onbtkkwkbgusc.public.blob.vercel-storage.com/images/img_dog_default-vbfra7RkKndq0xCOJhUExOVRVTNRwo.png";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(length = 50)
    private String email;

    @NotNull
    @Column(length = 20)
    private String name;

    @Column(name = "image_url")
    private String imageUrl;

    public Member(String email, String name, String imageUrl) {
        this(null, email, name, imageUrl);
    }

    public Member(String email, String name) {
        this(null, email, name, MEMBER_DEFAULT_IMAGE_URL);
    }

    public boolean isSame(String email) {
        return this.email.equals(email);
    }
}
