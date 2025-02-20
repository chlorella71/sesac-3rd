package com.sesac.itall.domain.answer;

import com.sesac.itall.domain.common.DataNotFoundException;
import com.sesac.itall.domain.member.Member;
import com.sesac.itall.domain.member.MemberRepository;
import com.sesac.itall.domain.question.Question;
import com.sesac.itall.domain.question.QuestionRepository;
import com.sesac.itall.domain.question.QuestionResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class AnswerServiceImpl implements AnswerService{

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final MemberRepository memberRepository;

    @Override
    public void createAnswer(QuestionResponseDTO questionResponseDTO, AnswerCreateDTO answerCreateDTO, String email) {

        Question question= questionRepository.findById(questionResponseDTO.getId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원"));


        Answer answer = Answer.builder()
                .content(answerCreateDTO.getContent())
                .member(member)
                .question(question)
                .build();

//        answer.setRegdate(Timestamp.valueOf(LocalDateTime.now()));


        this.answerRepository.save(answer);
    }

    @Override
    public List<AnswerResponseDTO> getAnswerListByQuestion(Long questionId) {
        List<Answer> answerList = answerRepository.findByQuestionId(questionId);

        return answerList.stream().map(AnswerResponseDTO::new).collect(Collectors.toList());
    }

    @Override
    public AnswerResponseDTO getAnswer(Long id) {
        Answer answer = this.answerRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("answer not found"));

        // Answer 엔티티를 AnswerResponseDTO로 변환하여 반환
        return new AnswerResponseDTO(answer);
    }

    @Override
    public void modifyAnswer(AnswerModifyDTO answerModifyDTO) {

        Answer answer = this.answerRepository.findById(answerModifyDTO.getId())
                .orElseThrow(() -> new DataNotFoundException("존재하지 않는 게시글"));

        answer.update(answerModifyDTO.getContent());

        this.answerRepository.save(answer);
    }

    @Override
    public void deleteAnswer(AnswerResponseDTO answerResponseDTO) {

        Answer answer = this.answerRepository.findById(answerResponseDTO.getId())
                .orElseThrow(() -> new DataNotFoundException("존재하지 않는 게시글"));

        this.answerRepository.delete(answer);
    }
}
