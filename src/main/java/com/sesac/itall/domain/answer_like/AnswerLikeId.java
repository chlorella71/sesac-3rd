package com.sesac.itall.domain.answer_like;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Embeddable
@EqualsAndHashCode
public class AnswerLikeId implements Serializable {

    private Long answerId;
    private Long memberId;

    public AnswerLikeId() {}

    public AnswerLikeId(Long answerId, Long memberId) {
        this.answerId = answerId;
        this.memberId = memberId;
    }
}
