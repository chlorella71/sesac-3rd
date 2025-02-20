package com.sesac.itall.domain.answer;

import com.sesac.itall.domain.common.DataNotFoundException;
import com.sesac.itall.domain.question.QuestionResponseDTO;
import com.sesac.itall.domain.question.QuestionService;
import com.sun.net.httpserver.HttpsServer;
import jakarta.persistence.PreUpdate;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;

@RequestMapping("/answer")
@RequiredArgsConstructor
@Controller
public class AnswerController {

    private final QuestionService questionService;
    private final AnswerServiceImpl answerService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/create/{id}")
    public String createAnswer(Model model, @PathVariable("id") Long id, @Valid AnswerCreateDTO answerCreateDTO, BindingResult bindingResult, Principal principal) {

        QuestionResponseDTO questionResponseDTO= this.questionService.getQuestion(id);

        if (bindingResult.hasErrors()) {
            model.addAttribute("questionResponseDTO", questionResponseDTO);

            return "question_detail";
        }

        String email= principal.getName();

        this.answerService.createAnswer(questionResponseDTO, answerCreateDTO, email);

        return String.format("redirect:/question/detail/%s", id);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/modify/{id}")
    public String answerModify(Model model, @PathVariable("id") Long id, Principal principal) {

        AnswerResponseDTO answerResponseDTO = this.answerService.getAnswer(id);

        if (!answerResponseDTO.getEmail().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정권한이 없습니다.");
        }

        AnswerModifyDTO answerModifyDTO = new AnswerModifyDTO();
        answerModifyDTO.setId(id);
        answerModifyDTO.setContent(answerResponseDTO.getContent());
        answerModifyDTO.setQuestionId(answerResponseDTO.getQuestionId());

        model.addAttribute("answerModifyDTO", answerModifyDTO);

        return "answer_form";
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/modify/{id}")
    public String answerModify(@Valid AnswerModifyDTO answerModifyDTO, BindingResult bindingResult, Principal principal) {

        if (bindingResult.hasErrors()) {
            return "answer_form";
        }

        if (answerModifyDTO.getId() == null) {
            throw new DataNotFoundException("수정할 답변의 id가 필요합니다.");
        }

        AnswerResponseDTO answerResponseDTO = this.answerService.getAnswer(answerModifyDTO.getId());

        if (!answerResponseDTO.getEmail().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정권한이 없습니다.");
        }

        this.answerService.modifyAnswer(answerModifyDTO);

        return String.format("redirect:/question/detail/%s", answerModifyDTO.getQuestionId());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/delete/{id}")
    public String answerDelete(Principal principal, @PathVariable("id") Long id) {

        AnswerResponseDTO answerResponseDTO = this.answerService.getAnswer(id);

        if (!answerResponseDTO.getEmail().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "삭제권한이 없습니다.");
        }

        this.answerService.deleteAnswer(answerResponseDTO);

        return String.format("redirect:/question/detail/%s", answerResponseDTO.getQuestionId());
    }
}
