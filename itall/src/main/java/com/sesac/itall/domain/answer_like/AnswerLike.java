package com.sesac.itall.domain.answer_like;

import com.sesac.itall.domain.answer.Answer;
import com.sesac.itall.domain.member.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name="answer_like")
public class AnswerLike {

    @EmbeddedId
    private AnswerLikeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("memberId")
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("answerId")
    @JoinColumn(name = "answer_id", nullable = false)
    private Answer answer;

    public AnswerLike(Answer answer, Member member) {
        this.id = new AnswerLikeId(answer.getId(), member.getId());
        this.answer= answer;
        this.member= member;
    }



}
