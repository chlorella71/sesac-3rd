package com.sesac.itall.domain.answer;

import com.sesac.itall.domain.question.QuestionResponseDTO;

import java.util.List;

public interface AnswerService {
    void createAnswer(QuestionResponseDTO dto, String content, String email);
    List<AnswerResponseDTO> getAnswerListByQuestion(Long questionId);
}
