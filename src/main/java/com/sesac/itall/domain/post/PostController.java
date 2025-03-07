package com.sesac.itall.domain.post;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.blog.BlogService;
import com.sesac.itall.domain.folder.FolderResponseDTO;
import com.sesac.itall.domain.folder.FolderService;
import com.sesac.itall.domain.folder_category.FolderCategoryResponseDTO;
import com.sesac.itall.domain.folder_category.FolderCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/blog/{blogId}/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final BlogService blogService;
    private final FolderService folderService;
    private final FolderCategoryService folderCategoryService;

    // 포스트 작성 폼
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/create")
    public String createPostForm(@PathVariable("blogId") Long blogId, Model model, Principal principal) {
        try {
            Blog blog = blogService.getBlogById(blogId);

            // 블로그 소유자 확인
            if (!blog.getMember().getEmail().equals(principal.getName())) {
                return "redirect:/blog/" + blogId;
            }

            model.addAttribute("blog", blog);

            // 폴더 카테고리 목록
            List<FolderCategoryResponseDTO> categories = folderCategoryService.getCategoryResponseDTOListByBlogId(blogId);
            model.addAttribute("categories", categories);

            // 폴더 목록 (카테고리별로 그룹화)
            Map<Long, List<FolderResponseDTO>> foldersByCategory = new HashMap<>();
            for (FolderCategoryResponseDTO category : categories) {
                List<FolderResponseDTO> folders = folderService.getAllFoldersByCategoryId(category.getId());
                foldersByCategory.put(category.getId(), folders);
            }
            model.addAttribute("foldersByCategory", foldersByCategory);

            // DTO 생성
            model.addAttribute("postCreateDTO", new PostCreateDTO());

            return "post/post_form";
        } catch (Exception e) {
            return "redirect:/blog/" + blogId;
        }
    }

    // 포스트 저장 처리
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/create")
    public String createPost(@PathVariable("blogId") Long blogId,
                             @Valid @ModelAttribute("postCreateDTO") PostCreateDTO postCreateDTO,
                             BindingResult bindingResult,
                             Model model,
                             Principal principal) {

        if (bindingResult.hasErrors()) {
            // 에러 발생 시 필요한 데이터 다시 로딩
            Blog blog = blogService.getBlogById(blogId);
            model.addAttribute("blog", blog);

            List<FolderCategoryResponseDTO> categories = folderCategoryService.getCategoryResponseDTOListByBlogId(blogId);
            model.addAttribute("categories", categories);

            Map<Long, List<FolderResponseDTO>> foldersByCategory = new HashMap<>();
            for (FolderCategoryResponseDTO category : categories) {
                List<FolderResponseDTO> folders = folderService.getAllFoldersByCategoryId(category.getId());
                foldersByCategory.put(category.getId(), folders);
            }
            model.addAttribute("foldersByCategory", foldersByCategory);

            return "post/post_form";
        }

        try {
            Post post = postService.createPost(blogId, postCreateDTO, principal.getName());

            // 초안인 경우 초안 목록으로, 아니면 포스트 목록으로 이동
            if (post.isDraft()) {
                return "redirect:/blog/" + blogId; // 초안 목록 페이지가 없으므로 블로그 메인으로 이동
            } else {
                return "redirect:/blog/" + blogId; // 포스트 상세 페이지가 없으므로 블로그 메인으로 이동
            }
        } catch (Exception e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "post/post_form";
        }
    }

}
