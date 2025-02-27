package com.sesac.itall.domain.folder_category;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.blog.BlogService;
import com.sesac.itall.domain.blog.BlogUpdateDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;

@RequiredArgsConstructor
@Controller
@RequestMapping("/blog")
public class FolderCategoryController {

    private final BlogService blogService;
    private final FolderCategoryService folderCategoryService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{blogId}/category/create")
    public String createCategoryForm(@PathVariable("blogId") Long blogId, Model model) {
        // 블로그 존재 여부 및 소유권 확인
        Blog blog = blogService.getBlogById(blogId);
        if (!blog.getMember().getEmail().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
            return "redirect:/blog/" + blogId;   // 권한 없음
        }

        model.addAttribute("blog", blog);
        model.addAttribute("categoryCreateDTO", new FolderCategoryCreateDTO());

        return "category_form";
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{blogId}/category/create")
    public String createCategory(@PathVariable("blogId") Long blogId, @Valid @ModelAttribute("categoryCreateDTO") FolderCategoryCreateDTO folderCategoryCreateDTO, BindingResult bindingResult, Principal principal) {

        if (bindingResult.hasErrors()) {
            return "category_form";
        }

        try {
            folderCategoryService.createCategory(blogId, folderCategoryCreateDTO, principal.getName());
            return "redirect:/blog/" + blogId;
        } catch (AccessDeniedException e) {
            // 권한 없음
            return "redirect:/blog/" + blogId;
        } catch (EntityNotFoundException e) {
            // 블로그 없음
            return "redirect:/blog/list";
        }

//        Blog blog = blogService.getBlogById(blogId);
//
//        // 권한 확인
//        if (!blog.getMember().getEmail().equals(principal.getName())) {
//            return "redirect:/blog/" + blogId;
//        }
//
//        // 카테고리 생성
//        categoryService.createCategory(blog, FolderCategoryCreateDTO.getName());
//
//        return "redirect:/blog/" + blogId;
    }






}
