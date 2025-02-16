package com.sesac.itall.domain.member;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberCreateDto {

    @NotEmpty(message = "이메일은 필수항목입니다.")
    private String email;

    @Size(min = 3, max = 25)
    @NotEmpty(message = "닉네임은 필수항목입니다.")
    private String nickname;

    @NotEmpty(message = "비밀번호는 필수항목입니다.")
    private String password1;

    @NotEmpty(message = "비밀번호 확인은 필수항목입니다.")
    private String password2;

    @NotEmpty(message = "자기소개는 필수항목입니다.")
    private String intro;
}
