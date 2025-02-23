package com.sesac.itall.domain.answer_like;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnswerLikeResponseDTO {

    private Long answerId;
    private boolean liked;  // 내가 추천했는지 여부
    private Long likeCount;  // 추천 총 개수
    private List<String> nicknameList;  // 추천한 사용자 닉네임 목록
}
