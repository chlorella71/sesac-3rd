package com.sesac.itall.domain.question;

import com.sesac.itall.domain.answer.AnswerCreateDTO;
import com.sesac.itall.domain.answer.AnswerResponseDTO;
import com.sesac.itall.domain.answer.AnswerService;
import com.sesac.itall.domain.answer_like.AnswerLikeResponseDTO;
import com.sesac.itall.domain.answer_like.AnswerLikeService;
import com.sesac.itall.domain.question_category.QuestionCategoryRepository;
import com.sesac.itall.domain.question_category.QuestionCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Controller
@RequestMapping("/question")
public class QuestionController {

    private final QuestionService questionService;
    private final QuestionCategoryService questionCategoryService;
    private final AnswerService answerService;
    private final AnswerLikeService answerLikeService;

    @GetMapping("/list")
    public String list(Model model) {
        List<QuestionResponseDTO> questionResponseDTOList = this.questionService.getList();
        model.addAttribute("questionResponseDTOList", questionResponseDTOList);

        return "question_list";
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/create")
    public String questionCreate(Model model) {
        model.addAttribute("questionDTO", new QuestionCreateDTO());   // 빈 dto 전달(생성 시 사용)
        model.addAttribute("categories", questionCategoryService.getAllCategories());   // 카테고리 리스트 전달
        model.addAttribute("isModify", false);   // 등록인지 수정인지 구분

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
    public String detail(Model model, @PathVariable("id") Long id, AnswerCreateDTO answerCreateDTO, @AuthenticationPrincipal UserDetails userDetails) {

        Optional<UserDetails> userDetailsOptional = Optional.ofNullable(userDetails);

        // 질문 정보를 가져옴
        QuestionResponseDTO questionResponseDTO = this.questionService.getQuestion(id);

        // 해당 질문의 답변 리스트 가져오기
        List<AnswerResponseDTO> answerList = this.answerService.getAnswerListByQuestion(id);

        // 모든 답변의 추천정보를 저장할 맵 (로그인 여부 관계없이)
        Map<Long, AnswerLikeResponseDTO> answerLikeResponseDTOMap = new HashMap<>();

        for (AnswerResponseDTO answer : answerList) {
            // 로그인 여부에 관계없이 답변추천 정보는 항상 가져오기
            AnswerLikeResponseDTO answerLikeResponseDTO = answerLikeService.getAnswerLikeInfo(answer.getId());

            // 로그인한 경우에는 사용자의 추천 여부(liekd)도 확인
            if (userDetailsOptional.isPresent()) {
                answerLikeResponseDTO.setLiked(answerLikeService.getLikeStatus(userDetailsOptional.get().getUsername(), answer.getId()).isLiked());
            }
//            } else {
//                // 로그인하지 않은 경우 liked = false 로 설정
//                answerLikeResponseDTO.setLiked(false);
//            }

            answerLikeResponseDTOMap.put(answer.getId(), answerLikeResponseDTO);
        }

        model.addAttribute("questionResponseDTO", questionResponseDTO);
        model.addAttribute("answerList", answerList);   // 답변 리스트 추가
        model.addAttribute("answerLikeResponseDTOMap", answerLikeResponseDTOMap);   // 추천 정보 추가

        return "question_detail";
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/modify/{id}")
    public String questionModify(Model model, @PathVariable("id") Long id, Principal principal) {

        QuestionResponseDTO questionResponseDTO = this.questionService.getQuestion(id);

        if (!questionResponseDTO.getEmail().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정권한이 없습니다.");
        }

        // 기존 데이터를 채운 DTO 생성
        QuestionModifyDTO questionModifyDTO = new QuestionModifyDTO();
        questionModifyDTO.setId(id);
        questionModifyDTO.setTitle(questionResponseDTO.getTitle());
        questionModifyDTO.setContent(questionResponseDTO.getContent());
        questionModifyDTO.setCategoryId(questionResponseDTO.getCategoryId());

        // model에 DTO 추가
        model.addAttribute("questionDTO", questionModifyDTO);   // 수정 시 modifyDTO 사용
        model.addAttribute("categories", questionCategoryService.getAllCategories());
        model.addAttribute("isModify", true);   // 수정인지 구분

        return "question_form";

    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/modify/{id}")
    public String questionModify(@Valid QuestionModifyDTO questionModifyDTO, BindingResult bindingResult, Principal principal) {

        if (bindingResult.hasErrors()) {
            return "question_form";
        }

        if (questionModifyDTO.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정할 질문의 ID가 없습니다.");
        }

        QuestionResponseDTO questionResponseDTO = this.questionService.getQuestion(questionModifyDTO.getId());

        if (!questionResponseDTO.getEmail().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정권한이 없습니다.");
        }

        this.questionService.modifyQuestion(questionModifyDTO);

        return String.format("redirect:/question/detail/%s", questionModifyDTO.getId());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/delete/{id}")
    public String QuestionDelete(Principal principal, @PathVariable("id") Long id) {

        QuestionResponseDTO questionResponseDTO = this.questionService.getQuestion(id);

        if (!questionResponseDTO.getEmail().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "삭제권한이 없습니다.");
        }

        this.questionService.deleteQuestion(questionResponseDTO);

        return "redirect:/";
    }
}
