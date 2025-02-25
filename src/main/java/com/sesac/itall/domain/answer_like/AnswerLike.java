package com.sesac.itall.domain.answer_like;

import com.sesac.itall.domain.answer.Answer;
import com.sesac.itall.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // 기본 생성자 보호 (직접 사용 방지)
@Table(name="answer_like",
        uniqueConstraints = @UniqueConstraint(columnNames = {"answer_id", "member_id"}),   // 복합 unique 설정
        indexes = {
                @Index(name = "idx_answer_like_member", columnList = "member_id"),  // member_id 개별 인덱스
                @Index(name = "idx_answer_like_answer", columnList = "answer_id"),  // answer_id 개별 인덱스
//                @Index(name = "idx_answer_like_composite", columnList = "answer_id, member_id") // answer_id, member_id 복합 인덱스
        })
public class AnswerLike {

//    @EmbeddedId
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;    // 단일 기본 키 사용

    @ManyToOne(fetch = FetchType.LAZY)
//    @MapsId("memberId")
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
//    @MapsId("answerId")
    @JoinColumn(name = "answer_id", nullable = false)
    private Answer answer;

    @Column(nullable = false)
    private boolean liked;

    @Column(nullable = false, updatable = false)
    private LocalDateTime regdate;  // insert 시 자동 설정, update 불가능

    @Column
    private LocalDateTime modifydate;   // update 시 수동 변경

    // AnswerLike 객체 생성
    public AnswerLike(Member member, Answer answer) {
        this.member= member;
        this.answer= answer;
        this.liked= true;
        this.regdate = LocalDateTime.now(); // 생성 시점에 자동 설정
        this.modifydate = null; // 최초 생성 시에는 수정 기록 없음
    }

    // 추천 상태를 변경하는 메서드 (추천 / 추천 취소)
    public void updateAnswerLike() {
        this.liked = !this.liked;   // 추천 상태 변경
        this.modifydate = LocalDateTime.now();  // 수정 시간 업데이트
    }


//    @Builder
//    public AnswerLike(Member member, Answer answer, boolean liked, LocalDateTime regdate, LocalDateTime modifydate) {
//        this.member = member;
//        this.answer = answer;
//        this.liked = liked;
//        this.regdate = LocalDateTime.now(); // 기본값 설정
//        this.modifydate = modifydate;   // 필요시 업데이트 시점에서 설정 가능
//    }


//    @PrePersist
//    protected void onCreate() {
//        if (this.regdate == null) {
//            this.regdate = LocalDateTime.now();
//        }
//    }
//
//    @PreUpdate
//    public void onUpdate() {
//        this.modifydate = LocalDateTime.now();
//    }


    // 복합식별자 사용시 사용될 생성자
//    public AnswerLike(Answer answer, Member member) {
//        this.id = new AnswerLikeId(answer.getId(), member.getId());
//        this.answer= answer;
//        this.member= member;
//    }



}
