package com.sesac.itall.domain.question;

import com.sesac.itall.domain.common.DataNotFoundException;
import com.sesac.itall.domain.member.Member;
import com.sesac.itall.domain.member.MemberRepository;
import com.sesac.itall.domain.question_category.QuestionCategory;
import com.sesac.itall.domain.question_category.QuestionCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class QuestionServiceImpl implements QuestionService{

    private final QuestionRepository questionRepository;
    private final QuestionCategoryRepository questionCategoryRepository;
    private final MemberRepository memberRepository;

    @Override
    public List<QuestionResponseDTO> getList() {

        List<Question> questionList = this.questionRepository.findAll();

        return questionList.stream()
                .map(QuestionResponseDTO::new)
                .toList();  // 엔티티 리스트를 DTO 리스트로 변환
    }

    @Override
    public Question createQuestion(QuestionCreateDTO questionCreateDTO, String email) {

        // service에서 email로 Member 조회
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원"));

        // service에서 category 조회
        QuestionCategory category = questionCategoryRepository.findById(questionCreateDTO.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리 ID"));

        // builder 패턴으로 Question 생성
        Question question = Question.builder()
                .title(questionCreateDTO.getTitle())
                .content(questionCreateDTO.getContent())
                .member(member)
                .category(category)
                .build();

        return questionRepository.save(question);
    }

    @Override
    public QuestionResponseDTO getQuestion(Long id) {

        Question question = this.questionRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("question not found"));

        return new QuestionResponseDTO(question);
    }

    @Override
    public void modifyQuestion(QuestionModifyDTO questionModifyDTO) {

        Question question = this.questionRepository.findById(questionModifyDTO.getId())
                .orElseThrow(() -> new DataNotFoundException("존재하지 않는 게시글"));

        QuestionCategory category = this.questionCategoryRepository.findById(questionModifyDTO.getCategoryId())
                .orElseThrow(() -> new DataNotFoundException("존재하지 않는 카테고리"));

        // setter 대신 'update' 메서드 사용
        question.update(questionModifyDTO.getTitle(), questionModifyDTO.getContent(), category);

        this.questionRepository.save(question);
    }

    @Override
    public void deleteQuestion(QuestionResponseDTO questionResponseDTO) {

        Question question = this.questionRepository.findById(questionResponseDTO.getId())
                .orElseThrow(() -> new DataNotFoundException("존재하지 않는 게시물"));

        this.questionRepository.delete(question);
    }
}
