package com.sesac.itall.domain.member;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@Controller
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/signup")
    public String signup(MemberCreateDto memberCreateDto) {
        return "signup_form";
    }

    @PostMapping("/signup")
    public String signup(@Valid MemberCreateDto memberCreateDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "signup_form";   // 유효성 검사 실패 시 회원가입 폼 다시 띄움
        }

        // 비밀번호 확인 검증
        if (!memberCreateDto.getPassword1().equals(memberCreateDto.getPassword2())) {
            bindingResult.rejectValue("password2", "passwordInCorrect",
                    "2개의 패스워드가 일치하지 않습니다.");
            return "signup_form";
        }

        try {
            memberService.create(memberCreateDto.getEmail(),
                    memberCreateDto.getNickname(), memberCreateDto.getPassword1(), memberCreateDto.getIntro());
        } catch (DataIntegrityViolationException e) {   // db 제약 조건 위반 ( 예: UNIQUE 키 위반 )
            e.printStackTrace();
            bindingResult.reject("signupFailed", "이미 등록된 사용자입니다.");

            return "signup_form";
        } catch (IllegalArgumentException e) {  // 중복 이메일 또는 닉네임 예외
            bindingResult.reject("signupFailed", e.getMessage());

            return "signup_form";
        } catch (Exception e) { // 기타 예상치 못한 예외
            e.printStackTrace();    // 개발 중에는 유용하지만, 운영 환경에서는 로깅으로 대체하는 것이 좋음
            bindingResult.reject("signupFailed", "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");

            return "signup_form";
        }

        return "redirect:/";    // 성공 시 홈으로 리다이렉트

    }

    @GetMapping("/login")
    public String login() {
        return "login_form";
    }
}
