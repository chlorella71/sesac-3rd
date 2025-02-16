package com.sesac.itall.domain.member;

import lombok.Getter;

@Getter
public enum MemberRole {
    USER("ROLE_USER"), // 일반사용자
    ADMIN("ROLE_ADMIN"); // 관리자
//    MODERATOR // 중재자

    MemberRole(String value) {
        this.value= value;
    }

    private String value;
}
