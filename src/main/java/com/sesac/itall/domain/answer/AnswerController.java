package com.sesac.itall.domain.answer;

import com.sesac.itall.domain.question.QuestionResponseDTO;
import com.sesac.itall.domain.question.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;

@RequestMapping("/answer")
@RequiredArgsConstructor
@Controller
public class AnswerController {

    private final QuestionService questionService;
    private final AnswerServiceImpl answerService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/create/{id}")
    public String createAnswer(Model model, @PathVariable("id") Long id, @Valid AnswerCreateDTO answerCreateDTO, BindingResult bindingResult, String content, Principal principal) {

        QuestionResponseDTO questionResponseDTO= this.questionService.getQuestion(id);

        if (bindingResult.hasErrors()) {
            model.addAttribute("questionResponseDTO", questionResponseDTO);

            return "question_detail";
        }

        String email= principal.getName();

        this.answerService.createAnswer(questionResponseDTO, answerCreateDTO.getContent(), email);

        return String.format("redirect:/question/detail/%s", id);
    }
}
