package com.sesac.itall.domain.question;

import com.sesac.itall.domain.answer.Answer;
import com.sesac.itall.domain.member.Member;
import com.sesac.itall.domain.question_category.QuestionCategory;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
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

    @Column(columnDefinition = "DATE", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date regdate;

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
    private List<Answer> answers;

    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = QuestionStatus.ANSWERED;
        }
        if (this.regdate == null) {
            this.regdate =new Date();
        }
    }

    @Builder
    public Question(String title, String content, Member member, QuestionCategory category) {
        this.title = title;
        this.content = content;
        this.regdate = new Date();
        this.member = member;
        this.category = category;
        this.status = QuestionStatus.UNANSWERED;
    }
}
