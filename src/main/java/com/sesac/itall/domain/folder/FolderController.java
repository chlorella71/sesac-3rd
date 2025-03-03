package com.sesac.itall.domain.folder;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.blog.BlogService;
import com.sesac.itall.domain.folder_category.FolderCategory;
import com.sesac.itall.domain.folder_category.FolderCategoryService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Controller
@RequestMapping("/blog")
public class FolderController {

    private final BlogService blogService;
    private final FolderCategoryService folderCategoryService;
    private final FolderService folderService;

    /**
     * 폴더 생성 API - Ajax 요청 처리
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{blogId}/category/{categoryId}/folder/create")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> createFolder(
            @PathVariable("blogId") Long blogId,
            @PathVariable("categoryId") Long categoryId,
            @RequestBody @Valid FolderCreateDTO folderCreateDTO,
            Principal principal) {

        Map<String, Object> response = new HashMap<>();

        try {
            // 블로그 존재 및 소유권 확인
            Blog blog = blogService.getBlogById(blogId);
            if (!blog.getMember().getEmail().equals(principal.getName())) {
                response.put("success", false);
                response.put("message", "접근 권한이 없습니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            // 카테고리 확인
            FolderCategory category = folderCategoryService.getCategoryById(categoryId);
            if (!category.getBlog().getId().equals(blogId)) {
                response.put("success", false);
                response.put("message", "해당 블로그의 카테고리가 아닙니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // 폴더 생성
            Folder folder = folderService.createFolder(folderCreateDTO.getName(), category, null);

            // 응답 데이터
            FolderResponseDTO folderResponseDTO = new FolderResponseDTO(folder);
            response.put("success", true);
            response.put("message", "폴더가 성공적으로 생성되었습니다.");
            response.put("folder", folderResponseDTO);

            return ResponseEntity.ok(response);

        } catch (AccessDeniedException e) {
            response.put("success", false);
            response.put("message", "접근 권한이 없습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (EntityNotFoundException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "폴더 생성 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 카테고리별 폴더 목록 API
     */
    @GetMapping("/{blogId}/category/{categoryId}/folders")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getFoldersByCategory(
            @PathVariable("blogId") Long blogId,
            @PathVariable("categoryId") Long categoryId) {

        Map<String, Object> response = new HashMap<>();

        try {
            // 블로그 존재 확인
            blogService.getBlogById(blogId);

            // 카테고리 확인
            FolderCategory category = folderCategoryService.getCategoryById(categoryId);
            if (!category.getBlog().getId().equals(blogId)) {
                response.put("success", false);
                response.put("message", "해당 블로그의 카테고리가 아닙니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // 폴더 목록 조회
            List<FolderResponseDTO> folders = folderService.getRootFoldersByCategoryId(categoryId);

            response.put("success", true);
            response.put("folders", folders);

            return ResponseEntity.ok(response);

        } catch (EntityNotFoundException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "폴더 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 폴더 수정 API - Ajax 요청 처리
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{blogId}/folder/{folderId}/update")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateFolder(
            @PathVariable("blogId") Long blogId,
            @PathVariable("folderId") Long folderId,
            @RequestBody @Valid FolderUpdateDTO folderUpdateDTO,
            Principal principal) {

        Map<String, Object> response = new HashMap<>();

        try {
            // 블로그 존재 및 소유권 확인
            Blog blog = blogService.getBlogById(blogId);
            if (!blog.getMember().getEmail().equals(principal.getName())) {
                response.put("success", false);
                response.put("message", "접근 권한이 없습니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            // 폴더 수정
            Folder updatedFolder = folderService.updateFolder(folderId, folderUpdateDTO.getName());

            // 응답 데이터
            FolderResponseDTO folderResponseDTO = new FolderResponseDTO(updatedFolder);
            response.put("success", true);
            response.put("message", "폴더가 성공적으로 수정되었습니다.");
            response.put("folder", folderResponseDTO);

            return ResponseEntity.ok(response);

        } catch (AccessDeniedException e) {
            response.put("success", false);
            response.put("message", "접근 권한이 없습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (EntityNotFoundException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "폴더 수정 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 폴더 삭제 API - Ajax 요청 처리
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{blogId}/folder/{folderId}/delete")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> deleteFolder(
            @PathVariable("blogId") Long blogId,
            @PathVariable("folderId") Long folderId,
            Principal principal) {

        Map<String, Object> response = new HashMap<>();

        try {
            // 블로그 존재 및 소유권 확인
            Blog blog = blogService.getBlogById(blogId);
            if (!blog.getMember().getEmail().equals(principal.getName())) {
                response.put("success", false);
                response.put("message", "접근 권한이 없습니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            // 폴더 삭제
            folderService.deleteFolder(folderId);

            response.put("success", true);
            response.put("message", "폴더가 성공적으로 삭제되었습니다.");

            return ResponseEntity.ok(response);

        } catch (AccessDeniedException e) {
            response.put("success", false);
            response.put("message", "접근 권한이 없습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (EntityNotFoundException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "폴더 삭제 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
