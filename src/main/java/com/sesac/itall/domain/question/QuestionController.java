package com.sesac.itall.domain.question;

import com.sesac.itall.domain.question_category.QuestionCategoryRepository;
import com.sesac.itall.domain.question_category.QuestionCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@Controller
@RequestMapping("/question")
public class QuestionController {

    private final QuestionService questionService;
    private final QuestionCategoryService questionCategoryService;

    @GetMapping("/list")
    public String list(Model model) {
        List<QuestionResponseDTO> questionResponseDTOList = this.questionService.getList();
        model.addAttribute("questionResponseDTOList", questionResponseDTOList);

        return "question_list";
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/create")
    public String questionCreate(Model model) {
        model.addAttribute("questionCreateDTO", new QuestionCreateDTO());   // 빈 dto 전달
        //TODO member 받아와야하나?
        model.addAttribute("categories", questionCategoryService.getAllCategories());   // 카테고리 리스트 전달
        return "question_form"; // question_form.html 렌더링
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/create")
    public String questionCreate(@Valid @ModelAttribute("questionCreateDTO") QuestionCreateDTO dto, BindingResult bindingResult, Model model, Principal principal) {

        if (bindingResult.hasErrors()) {
            model.addAttribute("categories", questionCategoryService.getAllCategories());
            return "question_form"; // 유효성 검사 실패시 다시 폼으로 이동
        }

        String email = principal.getName(); // 현재 로그인한 사용자 정보 가져오기

        questionService.createQuestion(dto, email);
        return "redirect:/question/list";   // 질문 저장후 질문 목록으로 이동
    }

    @GetMapping(value = "/detail/{id}")
    public String detail(Model model, @PathVariable("id") Long id) {

        QuestionResponseDTO questionResponseDTO = this.questionService.getQuestion(id);

        model.addAttribute("questionResponseDTO", questionResponseDTO);

        return "question_detail";
    }
}
