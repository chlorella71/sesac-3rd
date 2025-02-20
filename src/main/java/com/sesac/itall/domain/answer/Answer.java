package com.sesac.itall.domain.answer;

import com.sesac.itall.domain.answer_like.AnswerLike;
import com.sesac.itall.domain.member.Member;
import com.sesac.itall.domain.question.Question;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "answer")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
//    @Temporal(TemporalType.TIMESTAMP)   // 시간까지 저장 가능
    private LocalDateTime regdate;

    @Column
    private LocalDateTime modifydate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @OneToMany(mappedBy = "answer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AnswerLike> answerLikeList;

    // 엔티티 생성 시 자동으로 등록 날짜 설정
    @PrePersist
    protected void onCreate() {
        if (this.regdate == null) {
            this.regdate = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.modifydate= LocalDateTime.now();   // 업데이트 시 자동 변경
    }

    // 빌더 패턴 적용
    @Builder
    public Answer(String content, Member member, Question question) {
        this.content = content;
        this.regdate = LocalDateTime.now();  // 생성 시 등록 날짜 자동 설정
        this.member = member;
        this.question = question;
    }

    public void update(String content) {
        this.content = content;
        this.modifydate = LocalDateTime.now();
    }
}
