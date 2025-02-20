package com.sesac.itall.domain.question;

import com.sesac.itall.domain.answer.AnswerResponseDTO;
import com.sesac.itall.domain.member.Member;

import java.util.List;

public interface QuestionService {
    List<QuestionResponseDTO> getList();
    Question createQuestion(QuestionCreateDTO questionCreateDTO, String email);
    QuestionResponseDTO getQuestion(Long id);
    void modifyQuestion(QuestionModifyDTO questionModifyDTO);
    void deleteQuestion(QuestionResponseDTO questionResponseDTO);
}
