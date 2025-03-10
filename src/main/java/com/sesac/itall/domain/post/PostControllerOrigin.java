//package com.sesac.itall.domain.post;
//
//import com.sesac.itall.domain.blog.Blog;
//import com.sesac.itall.domain.blog.BlogService;
//import com.sesac.itall.domain.folder.Folder;
//import com.sesac.itall.domain.folder.FolderResponseDTO;
//import com.sesac.itall.domain.folder.FolderService;
//import com.sesac.itall.domain.folder_category.FolderCategory;
//import com.sesac.itall.domain.folder_category.FolderCategoryResponseDTO;
//import com.sesac.itall.domain.folder_category.FolderCategoryService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.validation.BindingResult;
//import org.springframework.web.bind.annotation.*;
//
//import java.security.Principal;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@Controller
//@RequestMapping("/blog")
//@RequiredArgsConstructor
//public class PostControllerOrigin {
//
//    private final PostService postService;
//    private final BlogService blogService;
//    private final FolderService folderService;
//    private final FolderCategoryService folderCategoryService;
//
//    // 포스트 작성 폼
//    @PreAuthorize("isAuthenticated()")
//    @GetMapping("/{blogId}/post/create")
//    public String createPostForm(@PathVariable("blogId") Long blogId, Model model, Principal principal) {
//        try {
//            Blog blog = blogService.getBlogById(blogId);
//
//            // 블로그 소유자 확인
//            if (!blog.getMember().getEmail().equals(principal.getName())) {
//                return "redirect:/blog/" + blogId;
//            }
//
//            model.addAttribute("blog", blog);
//
//            // 폴더 카테고리 목록
//            List<FolderCategoryResponseDTO> categories = folderCategoryService.getCategoryResponseDTOListByBlogId(blogId);
//            model.addAttribute("categories", categories);
//
//            // 폴더 목록 (카테고리별로 그룹화)
//            Map<Long, List<FolderResponseDTO>> foldersByCategory = new HashMap<>();
//            for (FolderCategoryResponseDTO category : categories) {
//                List<FolderResponseDTO> folders = folderService.getAllFoldersByCategoryId(category.getId());
//                foldersByCategory.put(category.getId(), folders);
//            }
//            model.addAttribute("foldersByCategory", foldersByCategory);
//
//            // DTO 생성
//            model.addAttribute("postCreateDTO", new PostCreateDTO());
//
//            return "post/post_form";
//        } catch (Exception e) {
//            return "redirect:/blog/" + blogId;
//        }
//    }
//
//    // 포스트 저장 처리
//    @PreAuthorize("isAuthenticated()")
//    @PostMapping("/{blogId}/post/create")
//    public String createPost(@PathVariable("blogId") Long blogId,
//                             @Valid @ModelAttribute("postCreateDTO") PostCreateDTO postCreateDTO,
//                             BindingResult bindingResult,
//                             Model model,
//                             Principal principal) {
//
//        if (bindingResult.hasErrors()) {
//            // 에러 발생 시 필요한 데이터 다시 로딩
//            Blog blog = blogService.getBlogById(blogId);
//            model.addAttribute("blog", blog);
//
//            List<FolderCategoryResponseDTO> categories = folderCategoryService.getCategoryResponseDTOListByBlogId(blogId);
//            model.addAttribute("categories", categories);
//
//            Map<Long, List<FolderResponseDTO>> foldersByCategory = new HashMap<>();
//            for (FolderCategoryResponseDTO category : categories) {
//                List<FolderResponseDTO> folders = folderService.getAllFoldersByCategoryId(category.getId());
//                foldersByCategory.put(category.getId(), folders);
//            }
//            model.addAttribute("foldersByCategory", foldersByCategory);
//
//            return "post/post_form";
//        }
//
//        try {
//            Post post = postService.createPost(blogId, postCreateDTO, principal.getName());
//
//            // 초안인 경우 초안 목록으로, 아니면 포스트 목록으로 이동
//            if (post.isDraft()) {
//                return "redirect:/blog/" + blogId; // 초안 목록 페이지가 없으므로 블로그 메인으로 이동
//            } else {
//                return "redirect:/blog/" + blogId; // 포스트 상세 페이지가 없으므로 블로그 메인으로 이동
//            }
//        } catch (Exception e) {
//            model.addAttribute("errorMessage", e.getMessage());
//            return "post/post_form";
//        }
//    }
//
//    /**
//     * 블로그의 모든 포스트 조회 API
//     */
//    @GetMapping("/{blogId}/posts")
//    @ResponseBody
//    public ResponseEntity<Map<String, Object>> getBlogPosts(@PathVariable("blogId") Long blogId) {
//        try {
//            // 블로그 존재 확인
//            Blog blog = blogService.getBlogById(blogId);
//
//            // 블로그의 모든 포스트 조회 (초안 제외)
//            List<PostResponseDTO> posts = postService.getPostsByBlogId(blogId);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", true);
//            response.put("posts", posts);
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            Map<String, Object> errorResponse = new HashMap<>();
//            errorResponse.put("success", false);
//            errorResponse.put("message", "포스트 조회 중 오류가 발생했습니다: " + e.getMessage());
//
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//        }
//    }
//
//    /**
//     * 특정 폴더의 모든 포스트 조회 API
//     */
//    @GetMapping("/{blogId}/folder/{folderId}/posts")
//    @ResponseBody
//    public ResponseEntity<Map<String, Object>> getFolderPosts(
//            @PathVariable("blogId") Long blogId,
//            @PathVariable("folderId") Long folderId) {
//        try {
//            // 블로그 존재 확인
//            Blog blog = blogService.getBlogById(blogId);
//
//            // 폴더가 블로그에 속하는지 확인
//            Folder folder = folderService.getFolderById(folderId);
//            if (!folder.getFolderCategory().getBlog().getId().equals(blogId)) {
//                throw new IllegalArgumentException("해당 블로그의 폴더가 아닙니다.");
//            }
//
//            // 폴더의 모든 포스트 조회
//            List<PostResponseDTO> posts = postService.getPostsByFolderId(folderId);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", true);
//            response.put("posts", posts);
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            Map<String, Object> errorResponse = new HashMap<>();
//            errorResponse.put("success", false);
//            errorResponse.put("message", "폴더 포스트 조회 중 오류가 발생했습니다: " + e.getMessage());
//
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//        }
//    }
//
//    /**
//     * 특정 카테고리의 모든 포스트 조회 API
//     */
//    @GetMapping("/{blogId}/category/{categoryId}/posts")
//    @ResponseBody
//    public ResponseEntity<Map<String, Object>> getCategoryPosts(
//            @PathVariable("blogId") Long blogId,
//            @PathVariable("categoryId") Long categoryId) {
//        try {
//            // 블로그 존재 확인
//            Blog blog = blogService.getBlogById(blogId);
//
//            // 카테고리가 블로그에 속하는지 확인
//            FolderCategory category = folderCategoryService.getCategoryById(categoryId);
//            if (!category.getBlog().getId().equals(blogId)) {
//                throw new IllegalArgumentException("해당 블로그의 카테고리가 아닙니다.");
//            }
//
//            // 카테고리의 모든 포스트 조회
//            List<PostResponseDTO> posts = postService.getPostsByCategoryId(categoryId);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", true);
//            response.put("posts", posts);
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            Map<String, Object> errorResponse = new HashMap<>();
//            errorResponse.put("success", false);
//            errorResponse.put("message", "카테고리 포스트 조회 중 오류가 발생했습니다: " + e.getMessage());
//
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//        }
//    }
//
//}
