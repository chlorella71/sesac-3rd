package com.sesac.itall.domain.blog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BlogCreateDTO {

    @NotBlank(message = "블로그 제목은 필수입니다.")
    @Size(min = 2, max = 100, message = "블로그 제목은 2-100자 사이여야 합니다.")
    private String title;

    @Size(max = 500, message = "블로그 소개는 500자 이내여야 합니다.")
    private String intro;
}
