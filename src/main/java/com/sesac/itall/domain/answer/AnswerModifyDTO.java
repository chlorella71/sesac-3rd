package com.sesac.itall.domain.answer;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AnswerModifyDTO {

    @NotNull(message = "id는 필수 값입니다.")
    private Long id;

    @NotEmpty(message= "내용을 입력해주세요.")
    private String content;

    @NotNull(message = "질문 id는 필수 값입니다.")
    private Long questionId;
}
