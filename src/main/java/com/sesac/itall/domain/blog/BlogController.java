package com.sesac.itall.domain.blog;

import com.sesac.itall.domain.folder_category.FolderCategory;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    @GetMapping("/{id}")
    public String blogDetail(@PathVariable("id") Long id, Model model) {
        try {
            Blog blog = blogService.getBlogById(id);

            BlogResponseDTO blogResponseDTO = new BlogResponseDTO(blog);
            model.addAttribute("blogResponseDTO", blogResponseDTO);

            // 블로그의 카테고리 목록 가져오기
            List<FolderCategory> folderCategoryList = blog.getFolderCategoryList();
            model.addAttribute("folderCategoryList", folderCategoryList);

            return "blog_detail";
        } catch (IllegalArgumentException e) {
            // 예외 처리: 존재하지 않는 블로그 ID인 경우 리다이렉트
            return "redirect:/blog/list";
        }
    }

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

//    /**
//     * 블로그 설정 페이지
//     */
//    @PreAuthorize("isAuthenticated()")
//    @GetMapping("/{id}/settings")
//    public String blogSettings(@PathVariable("id") Long id, Model model, Principal principal) {
//
//        Blog blog = blogService.getBlogById(id);
//
//        // 블로그 소유 여부 확인
//        if (!blog.getMember().getEmail().equals(principal.getName())) {
//            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "접근 권한이 없습니다.");
//        }
//
//        // 업데이트 DTO 생성 및 초기값 설정
//        BlogUpdateDTO blogUpdateDTO = new BlogUpdateDTO();
//        blogUpdateDTO.setTitle(blog.getTitle());
//        blogUpdateDTO.setIntro(blog.getIntro());
//
//        model.addAttribute("blog", blog);
//        model.addAttribute("blogUpdateDTO", blogUpdateDTO);
//
//        return "blog_settings";
//    }
//
//    /**
//     * 블로그 정보 업데이트
//     */
//    @PreAuthorize("isAuthenticated()")
//    @PostMapping("/{id}/settings/update")
//    public String updateBlog(@PathVariable("id") Long id, @Valid @ModelAttribute BlogUpdateDTO blogUpdateDTO, BindingResult bindingResult, Principal principal, Model model) {
//        Blog blog = blogService.getBlogById(id);
//
//        // 블로그 소유 여부 확인
//        if (!blog.getMember().getEmail().equals(principal.getName())) {
//            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "접근 권한이 없습니다.");
//        }
//
//        if (bindingResult.hasErrors()) {
//            model.addAttribute("blog", blog);
//            return "blog_settings";
//        }
//
//        // 블로그 정보 업데이트
//        blogService.updateBlog(id, blogUpdateDTO.getTitle(), blogUpdateDTO.getIntro());
//
//        return "redirect:/blog/" +id;
//    }
}
