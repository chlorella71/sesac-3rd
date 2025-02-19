package com.sesac.itall.domain.answer;

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
    public void createAnswer(QuestionResponseDTO questionResponseDTO, String content, String email) {

        Question question= questionRepository.findById(questionResponseDTO.getId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원"));

        Answer answer = new Answer();
        answer.setContent(content);
        answer.setRegdate(Timestamp.valueOf(LocalDateTime.now()));
        answer.setMember(member);
        answer.setQuestion(question);

        this.answerRepository.save(answer);
    }

    @Override
    public List<AnswerResponseDTO> getAnswerListByQuestion(Long questionId) {
        List<Answer> answerList = answerRepository.findByQuestionId(questionId);

        return answerList.stream().map(AnswerResponseDTO::new).collect(Collectors.toList());
    }
}
