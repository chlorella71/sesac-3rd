package com.sesac.itall.domain.member;

import com.sesac.itall.domain.answer_like.AnswerLike;
import com.sesac.itall.domain.question.Question;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "member")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "VARCHAR", nullable = false, unique = true, length = 100)
    private String email;

    @Column(columnDefinition = "VARCHAR", nullable = false, unique = true, length = 50)
    private String nickname;

    @Column(columnDefinition = "VARCHAR", nullable = false)
    private String password;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String intro;

    @Enumerated(EnumType.STRING)
//    @Column(columnDefinition = "ENUM('ACTIVE', 'INACTIVE')", nullable = false)
    private MemberStatus status = MemberStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
//    @Column(columnDefinition = "ENUM('USER', 'ADMIN')", nullable = false)
    private MemberRole role;


    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AnswerLike> answerLikes;

    @PrePersist
    protected void onCreate() {
        if (this.role == null) {
            this.role = MemberRole.USER;   // 기본값 설정
        }

        if (this.status == null) {
            this.status = MemberStatus.ACTIVE;
        }
    }
}
