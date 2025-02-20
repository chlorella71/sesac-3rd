package com.sesac.itall.domain.question;

import com.sesac.itall.domain.answer.Answer;
import com.sesac.itall.domain.member.Member;
import com.sesac.itall.domain.question_category.QuestionCategory;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.grammars.hql.HqlParser;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="question")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "VARCHAR", nullable = false)
    private String title;

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
    @JoinColumn(name = "category_id", nullable = false)
    private QuestionCategory category;

    @Enumerated(EnumType.STRING)
//    @Column(columnDefinition = "ENUM('ANSWERED', 'UNANSWERED')", nullable = false)
    private QuestionStatus status;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answerList;

    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = QuestionStatus.ANSWERED;
        }
        if (this.regdate == null) {
            this.regdate = LocalDateTime.now(); // 엔티티 생성 시 자동 저장
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.modifydate= LocalDateTime.now();   // 업데이트 시 자동 변경
    }

    @Builder
    public Question(String title, String content, Member member, QuestionCategory category) {
        this.title = title;
        this.content = content;
        this.regdate = LocalDateTime.now();
        this.member = member;
        this.category = category;
        this.status = QuestionStatus.UNANSWERED;
    }

    // @Setter 대신 update 메서드 추가
    public void update(String title, String content, QuestionCategory category) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.modifydate = LocalDateTime.now();  // 수정 시간 업데이트
    }
}
