package com.sesac.itall.domain.question;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionModifyDTO {

    @NotNull(message = "id는 필수 값입니다.")
    private Long id;    // 수정할때는 ID가 필요

    @NotBlank(message= "제목을 입력해주세요.")
    private String title;

    @NotBlank(message= "내용을 입력해주세요.")
    private String content;

    @NotNull(message= "카테고리를 선택해주세요.")
    private Long categoryId;    // 카테고리 ID (선택적으로 변경 가능)
}
