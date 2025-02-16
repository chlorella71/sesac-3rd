package com.sesac.itall.domain.question_category;

import com.sesac.itall.domain.question.Question;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity

public class QuestionCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
//    @Column(columnDefinition = "ENUM(TECH, CAREER, STUDY)", nullable = false)
    private QuestionCategoryEnum category;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;

}
