package com.sesac.itall.domain.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostUpdateDTO {

    @NotNull(message = "id는 필수 값입니다.")
    private Long id;

    @NotBlank(message = "제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "내용을 입력해주세요.")
    private String content;

    @NotNull(message = "폴더를 선택해주세요.")
    private Long folderId;

    // 초안 여부
    private boolean draft;

}
