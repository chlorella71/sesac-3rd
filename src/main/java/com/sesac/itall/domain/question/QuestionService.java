package com.sesac.itall.domain.question;

import com.sesac.itall.domain.member.Member;

import java.util.List;

public interface QuestionService {
    List<QuestionResponseDTO> getList();
    Question createQuestion(QuestionCreateDTO dto, String email);
    QuestionResponseDTO getQuestion(Long id);
}
