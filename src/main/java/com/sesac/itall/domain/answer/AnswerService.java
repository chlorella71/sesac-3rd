package com.sesac.itall.domain.answer;

import com.sesac.itall.domain.question.QuestionResponseDTO;

import java.util.List;

public interface AnswerService {
    void createAnswer(QuestionResponseDTO dto, AnswerCreateDTO answerCreateDTO, String email);
    List<AnswerResponseDTO> getAnswerListByQuestion(Long questionId);
    AnswerResponseDTO getAnswer(Long id);
    void modifyAnswer(AnswerModifyDTO answerModifyDTO);
    void deleteAnswer(AnswerResponseDTO answerResponseDTO);
}
