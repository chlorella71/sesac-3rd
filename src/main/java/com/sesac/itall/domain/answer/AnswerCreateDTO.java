package com.sesac.itall.domain.answer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerCreateDTO {

    @NotEmpty(message= "내용을 입력해주세요.")
    private String content;

//    @NotNull(message = "질문 ID가 필요합니다.")
//    private Long questionId;    // 어떤 질문에 대한 답변인지 저장
//
//    @NotNull(message = "작성자 ID가 필요합니다.")
//    private Long memberId;  // 작성자 정보 (로그인한 사용자)
}
