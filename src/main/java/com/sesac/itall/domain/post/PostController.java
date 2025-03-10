package com.sesac.itall.domain.post;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.blog.BlogService;
import com.sesac.itall.domain.common.DataNotFoundException;
import com.sesac.itall.domain.folder.Folder;
import com.sesac.itall.domain.folder.FolderResponseDTO;
import com.sesac.itall.domain.folder.FolderService;
import com.sesac.itall.domain.folder_category.FolderCategory;
import com.sesac.itall.domain.folder_category.FolderCategoryResponseDTO;
import com.sesac.itall.domain.folder_category.FolderCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/blog")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final BlogService blogService;
    private final FolderService folderService;
    private final FolderCategoryService folderCategoryService;

    /**
     * 포스트 상세 조회 전체 페이지
     */
    @GetMapping("/{blogId}/post/{postId}")
    public String viewPost(@PathVariable("blogId") Long blogId,
                           @PathVariable("postId") Long postId,
                           Model model,
                           Principal principal) {
        try {
            // 블로그 정보 조회
            Blog blog = blogService.getBlogById(blogId);
            model.addAttribute("blogResponseDTO", new com.sesac.itall.domain.blog.BlogResponseDTO(blog));

            // 포스트 상세 정보 조회
            PostResponseDTO post = postService.getPostById(postId);

            // 블로그 ID 검증 (해당 블로그의 포스트가 맞는지)
            if (!post.getBlogId().equals(blogId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 블로그의 포스트가 아닙니다.");
            }

            // 초안인 경우 작성자만 접근 가능
            if (post.isDraft() && (principal == null || !post.getEmail().equals(principal.getName()))) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자만 접근 가능한 초안입니다.");
            }

            model.addAttribute("post", post);

            // 블로그의 카테고리 목록 가져오기
            List<FolderCategory> folderCategoryList = blog.getFolderCategoryList();
            model.addAttribute("folderCategoryList", folderCategoryList);

            return "blog/blog_detail";
        } catch (DataNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "포스트를 찾을 수 없습니다.", e);
        }
    }

    /**
     * AJAX 요청용 - 포스트 내용만 반환
     */
    @GetMapping("/{blogId}/post/{postId}/content")
    public String getPostContent(@PathVariable("blogId") Long blogId,
                                 @PathVariable("postId") Long postId,
                                 Model model,
                                 Principal principal) {
        try {
            // 포스트 상세 정보 조회
            PostResponseDTO post = postService.getPostById(postId);

            // 블로그 ID 검증 (해당 블로그의 포스트가 맞는지)
            if (!post.getBlogId().equals(blogId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 블로그의 포스트가 아닙니다.");
            }

            // 초안인 경우 작성자만 접근 가능
            if (post.isDraft() && (principal == null || !post.getEmail().equals(principal.getName()))) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자만 접근 가능한 초안입니다.");
            }

            model.addAttribute("post", post);

            return "post/post_content :: postContent";
        } catch (DataNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "포스트를 찾을 수 없습니다.", e);
        }
    }

    // 포스트 작성 폼
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{blogId}/post/create")
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
    @PostMapping("/{blogId}/post/create")
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

            // 생성 후 해당 포스트 상세 페이지로 리다이렉트
            return "redirect:/blog/" + blogId + "/post/" + post.getId();
        } catch (Exception e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "post/post_form";
        }
    }

    /**
     * 블로그의 모든 포스트 조회 API
     */
    @GetMapping("/{blogId}/posts")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getBlogPosts(@PathVariable("blogId") Long blogId) {
        try {
            // 블로그 존재 확인
            Blog blog = blogService.getBlogById(blogId);

            // 블로그의 모든 포스트 조회 (초안 제외)
            List<PostResponseDTO> posts = postService.getPostsByBlogId(blogId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("posts", posts);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "포스트 조회 중 오류가 발생했습니다: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 특정 폴더의 모든 포스트 조회 API
     */
    @GetMapping("/{blogId}/folder/{folderId}/posts")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getFolderPosts(
            @PathVariable("blogId") Long blogId,
            @PathVariable("folderId") Long folderId) {
        try {
            // 블로그 존재 확인
            Blog blog = blogService.getBlogById(blogId);

            // 폴더가 블로그에 속하는지 확인
            Folder folder = folderService.getFolderById(folderId);
            if (!folder.getFolderCategory().getBlog().getId().equals(blogId)) {
                throw new IllegalArgumentException("해당 블로그의 폴더가 아닙니다.");
            }

            // 폴더의 모든 포스트 조회
            List<PostResponseDTO> posts = postService.getPostsByFolderId(folderId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("posts", posts);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "폴더 포스트 조회 중 오류가 발생했습니다: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 특정 카테고리의 모든 포스트 조회 API
     */
    @GetMapping("/{blogId}/category/{categoryId}/posts")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getCategoryPosts(
            @PathVariable("blogId") Long blogId,
            @PathVariable("categoryId") Long categoryId) {
        try {
            // 블로그 존재 확인
            Blog blog = blogService.getBlogById(blogId);

            // 카테고리가 블로그에 속하는지 확인
            FolderCategory category = folderCategoryService.getCategoryById(categoryId);
            if (!category.getBlog().getId().equals(blogId)) {
                throw new IllegalArgumentException("해당 블로그의 카테고리가 아닙니다.");
            }

            // 카테고리의 모든 포스트 조회
            List<PostResponseDTO> posts = postService.getPostsByCategoryId(categoryId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("posts", posts);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "카테고리 포스트 조회 중 오류가 발생했습니다: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 포스트 수정 폼 보기
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{blogId}/post/{postId}/edit")
    public String editPostForm(@PathVariable("blogId") Long blogId,
                               @PathVariable("postId") Long postId,
                               Model model,
                               Principal principal) {

        // 블로그 정보 조회
        Blog blog = blogService.getBlogById(blogId);
        model.addAttribute("blog", blog);

        // 포스트 정보 조회
        PostResponseDTO post = postService.getPostById(postId);

        // 권한 검사 - 본인 글만 수정 가능
        if (!post.getEmail().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다.");
        }

        // 포스트 수정을 위한 DTO 생성
        PostUpdateDTO postUpdateDTO = new PostUpdateDTO();
        postUpdateDTO.setId(postId);
        postUpdateDTO.setTitle(post.getTitle());
        postUpdateDTO.setContent(post.getContent());
        postUpdateDTO.setFolderId(post.getFolderId());
        postUpdateDTO.setDraft(post.isDraft());

        model.addAttribute("postUpdateDTO", postUpdateDTO);

        // 카테고리 목록 조회
        List<FolderCategoryResponseDTO> categories = folderCategoryService.getCategoryResponseDTOListByBlogId(blogId);
        model.addAttribute("categories", categories);

        // 카테고리별 폴더 목록 조회
        Map<Long, List<FolderResponseDTO>> foldersByCategory = new HashMap<>();
        for (FolderCategoryResponseDTO category : categories) {
            List<FolderResponseDTO> folders = folderService.getAllFoldersByCategoryId(category.getId());
            foldersByCategory.put(category.getId(), folders);
        }
        model.addAttribute("foldersByCategory", foldersByCategory);

        return "post/post_edit";
    }

    /**
     * 포스트 수정 처리
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{blogId}/post/{postId}/edit")
    public String editPost(@PathVariable("blogId") Long blogId,
                           @PathVariable("postId") Long postId,
                           @Valid @ModelAttribute PostUpdateDTO postUpdateDTO,
                           BindingResult bindingResult,
                           Principal principal,
                           Model model) {

        // 유효성 검사 실패 시
        if (bindingResult.hasErrors()) {
            // 블로그 정보 조회
            Blog blog = blogService.getBlogById(blogId);
            model.addAttribute("blog", blog);

            // 카테고리 목록 조회
            List<FolderCategoryResponseDTO> categories = folderCategoryService.getCategoryResponseDTOListByBlogId(blogId);
            model.addAttribute("categories", categories);

            // 카테고리별 폴더 목록 조회
            Map<Long, List<FolderResponseDTO>> foldersByCategory = new HashMap<>();
            for (FolderCategoryResponseDTO category : categories) {
                List<FolderResponseDTO> folders = folderService.getAllFoldersByCategoryId(category.getId());
                foldersByCategory.put(category.getId(), folders);
            }
            model.addAttribute("foldersByCategory", foldersByCategory);

            return "post/post_edit";
        }

        try {
            // 포스트 수정 처리
            PostResponseDTO updatedPost = postService.updatePost(postUpdateDTO, principal.getName());

            // 포스트 상세 페이지로 리다이렉트
            return "redirect:/blog/" + blogId + "/post/" + postId;
        } catch (ResponseStatusException e) {
            // 권한 오류
            model.addAttribute("errorMessage", e.getReason());
            return "post/post_edit";
        }
    }

    /**
     * 포스트 삭제
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{blogId}/post/{postId}/delete")
    public String deletePost(@PathVariable("blogId") Long blogId,
                             @PathVariable("postId") Long postId,
                             Principal principal) {

        // 포스트 정보 조회
        PostResponseDTO post = postService.getPostById(postId);

        // 권한 검사 - 본인 글만 삭제 가능
        if (!post.getEmail().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제 권한이 없습니다.");
        }

        // 포스트 삭제 처리
        postService.deletePost(postId, principal.getName());

        // 블로그 메인 페이지로 리다이렉트
        return "redirect:/blog/" + blogId;
    }

    /**
     * 블로그 작성자의 초안 포스트 목록 조회 API
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{blogId}/drafts")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getDrafts(@PathVariable("blogId") Long blogId, Principal principal) {
        try {
            // 블로그 존재 확인
            Blog blog = blogService.getBlogById(blogId);

            // 블로그 소유자만 초안을 볼 수 있음
            if (!blog.getMember().getEmail().equals(principal.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "접근 권한이 없습니다."));
            }

            // 초안 포스트 목록 조회
            List<PostResponseDTO> drafts = postService.getDraftsByBlogId(blogId, principal.getName());

            return ResponseEntity.ok(Map.of("success", true, "posts", drafts));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "초안 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    /**
     * 초안을 정식 게시물로 발행
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{blogId}/post/{postId}/publish")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> publishDraft(
            @PathVariable("blogId") Long blogId,
            @PathVariable("postId") Long postId,
            Principal principal) {

        try {
            // 블로그 확인
            Blog blog = blogService.getBlogById(blogId);

            // 포스트 발행
            Post post = postService.publishDraft(postId, principal.getName());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "포스트가 성공적으로 발행되었습니다.",
                    "post", new PostResponseDTO(post)
            ));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("success", false, "message", e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "포스트 발행 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}