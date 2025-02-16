package com.sesac.itall.domain.question;

import com.sesac.itall.domain.member.Member;

import java.util.List;

public interface QuestionService {
    List<Question> getList();
    Question createQuestion(QuestionCreateDTO dto, String email);
    Question getQuestion(Long id);
}
