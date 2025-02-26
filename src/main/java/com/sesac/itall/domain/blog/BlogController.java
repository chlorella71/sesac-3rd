package com.sesac.itall.domain.blog;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
@RequestMapping("/blog")
public class BlogController {

    private final BlogService blogService;

    // 전체 블로그 리스트 (비로그인/로그인 모두 접근 가능)
    @GetMapping("/list")
    public String blogList(Model model, @AuthenticationPrincipal UserDetails userDetails) {

        List<BlogResponseDTO> blogList = blogService.getAllBlogs();
        model.addAttribute("blogList", blogList);

        // 로그인 상태에 따라 추가 정보 전달
        if (userDetails != null) {
            model.addAttribute("isLoggedIn", true);
            model.addAttribute("currentUserEmail", userDetails.getUsername());
        } else {
            model.addAttribute("isLoggedIn", false);
        }

        return "blog_list";
    }

    //TODO: 블로그 상세 페이지 구현

    // 내 블로그 (로그인 required)
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public String myBlog(Principal principal) {

        String email = principal.getName();

        Optional<Blog> blog = blogService.findBlogByEmail(email);

        if (blog.isPresent()) {
            return "redirect:/blog/" + blog.get().getId();
        } else {
            return "redirect:/blog/create";
        }
    }

    // 블로그 생성 페이지
    @GetMapping("/create")
    public String createBlogForm(Model model) {
        model.addAttribute("blogCreateDTO", new BlogCreateDTO());
        return "blog_create";
    }

    // 블로그 생성 처리
    @PostMapping("/create")
    public String createBlog(@Valid BlogCreateDTO blogCreateDTO, BindingResult bindingResult, Principal principal) {
        if (bindingResult.hasErrors()) {
            return "blog_create";
        }

        String email = principal.getName();
        Blog blog = blogService.createBlog(email, blogCreateDTO);

        return "redirect:/blog/" + blog.getId();
    }
}
