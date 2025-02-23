package com.sesac.itall.domain.answer_like;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnswerLikeRequestDTO {

    private Long answerId;  // 추천할 답변 id
    private String email;   // 추천한 사용자 이메일
}
