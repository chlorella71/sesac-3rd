package com.sesac.itall.domain.folder_category;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.blog.BlogService;
import com.sesac.itall.domain.blog.BlogUpdateDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.EnumType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

        return "category/category_form";
    }

    // 폼 제출용 메소드 (HTML 응답) - 일반적인 폼 제출 시
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{blogId}/category/create")
    public String createCategory(@PathVariable("blogId") Long blogId,
                                 @Valid @ModelAttribute("categoryCreateDTO") FolderCategoryCreateDTO folderCategoryCreateDTO,
                                 BindingResult bindingResult,
                                 Principal principal) {

        if (bindingResult.hasErrors()) {
            return "category/category_form";
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
    }

    // AJAX 요청용 메소드 (JSON 응답) - AJAX로 호출할 때 사용
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{blogId}/category/create/ajax")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> createCategoryAjax(
            @PathVariable("blogId") Long blogId,
            @Valid @RequestBody FolderCategoryCreateDTO folderCategoryCreateDTO,
            BindingResult bindingResult,
            Principal principal) {

        Map<String, Object> response = new HashMap<>();

        // 유효성 검사 오류 처리
        if (bindingResult.hasErrors()) {
            response.put("success", false);
            response.put("message", "입력값이 유효하지 않습니다.");
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());
            response.put("errors", errors);
            return ResponseEntity.badRequest().body(response);
        }

        try {
            FolderCategory category = folderCategoryService.createCategory(
                    blogId, folderCategoryCreateDTO, principal.getName());

            // 응답 데이터 구성
            response.put("success", true);
            response.put("message", "카테고리가 성공적으로 생성되었습니다.");
            response.put("category", new FolderCategoryResponseDTO(category));

            return ResponseEntity.ok(response);
        } catch (AccessDeniedException e) {
            response.put("success", false);
            response.put("message", "접근 권한이 없습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (EntityNotFoundException e) {
            response.put("success", false);
            response.put("message", "블로그를 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "카테고리 생성 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 카테고리 삭제 처리 - AJAX 요청 처리
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{blogId}/category/{categoryId}/delete")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable("blogId") Long blogId, @PathVariable("categoryId") Long categoryId, Principal principal) {
        Map<String, Object> response = new HashMap<>();

        try {
            folderCategoryService.deleteCategory(blogId, categoryId, principal.getName());
            response.put("success", true);
            response.put("message", "카테고리가 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } catch (AccessDeniedException e) {
            response.put("success", false);
            response.put("message", "접근 권한이 없습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "카테고리 삭제 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 카테고리 수정 - ajax 요청 처리
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{blogId}/category/{categoryId}/update")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateCategoryAjax(@PathVariable("blogId") Long blogId, @PathVariable("categoryId") Long categoryId, @Valid @RequestBody FolderCategoryUpdateDTO folderCategoryUpdateDTO, BindingResult bindingResult, Principal principal) {
        Map<String, Object> response = new HashMap<>();

        // 유효성 검사 오류 처리
        if (bindingResult.hasErrors()) {
            response.put("success", false);
            response.put("message", "입력값이 유효하지 않습니다.");
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());
            response.put("errors", errors);
            return ResponseEntity.badRequest().body(response);
        }

        try {
            FolderCategoryResponseDTO folderCategoryResponseDTO = folderCategoryService.updateCategoryAndGetResponseDTO(blogId, categoryId, folderCategoryUpdateDTO, principal.getName());

            response.put("success", true);
            response.put("message", "카테고리가 수정되었습니다.");
            response.put("categoryResponseDTO", folderCategoryResponseDTO);
            return ResponseEntity.ok(response);
        } catch (AccessDeniedException e) {
            response.put("success", false);
            response.put("message", "접근 권한이 없습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (EntityNotFoundException e) {
            response.put("success", false);
            response.put("message", "카테고리를 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "카테고리 수정 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
