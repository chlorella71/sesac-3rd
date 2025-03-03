package com.sesac.itall.domain.folder_category;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.blog.BlogRepository;
import com.sesac.itall.domain.common.DataNotFoundException;
import com.sesac.itall.domain.folder.Folder;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderCategoryService {

    private final BlogRepository blogRepository;
    private final FolderCategoryRepository folderCategoryRepository;

    @Transactional
    public FolderCategory createCategory(Long blogId, FolderCategoryCreateDTO folderCategoryCreateDTO, String email) {

        // 블로그 조회
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataNotFoundException("블로그를 찾을 수 없습니다."));

        // 권한 검사
        if (!blog.getMember().getEmail().equals(email)) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        // 카테고리 생성
        FolderCategory folderCategory = new FolderCategory();
        folderCategory.setName(folderCategoryCreateDTO.getName());
        folderCategory.setBlog(blog);
        folderCategory.setRegdate(LocalDateTime.now());

        return folderCategoryRepository.save(folderCategory);
    }

    public List<FolderCategory> getCategoryListByBlogId(Long blogId) {
        return folderCategoryRepository.findByBlogId(blogId);
    }

    /**
     * 카테고리 ID로 카테고리 응답 DTO 조회
     */
    public FolderCategoryResponseDTO getCategoryResponseDTO(Long categoryId, String email) {
        // 카테고리 조회
        FolderCategory folderCategory = folderCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new DataNotFoundException("카테고리를 찾을 수 없습니다."));

        // 권한 검사
        if (!folderCategory.getBlog().getMember().getEmail().equals(email)) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        return new FolderCategoryResponseDTO(folderCategory);
    }

    /**
     * 블로그 ID로 카테고리 목록 응답 DTO 조회
     */
    public List<FolderCategoryResponseDTO> getCategoryResponseDTOListByBlogId(Long blogId) {
        List<FolderCategory> folderCategoryList = folderCategoryRepository.findByBlogId(blogId);

        return folderCategoryList.stream()
                .map(FolderCategoryResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * 카테고리 수정
     */
    @Transactional
    public void updateCategory(Long blogId, Long categoryId, FolderCategoryUpdateDTO folderCategoryUpdateDTO, String email) {
        // 블로그 조회
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataNotFoundException("블로그를 찾을 수 없습니다."));

        // 권한 검사
        if (!blog.getMember().getEmail().equals(email)) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        // 카테고리 조회
        FolderCategory folderCategory = folderCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new DataNotFoundException("카테고리를 찾을 수 없습니다."));

        // 카테고리가 해당 블로그에 속하는지 확인
        if (!folderCategory.getBlog().getId().equals(blogId)) {
            throw new AccessDeniedException("해당 블로그의 카테고리가 아닙니다.");
        }

        // 카테고리 이름 업데이트
        folderCategory.setName(folderCategoryUpdateDTO.getName());

        folderCategoryRepository.save(folderCategory);
    }

    /**
     * 카테고리 수정 후 응답 DTO 반환
     */
    @Transactional
    public FolderCategoryResponseDTO updateCategoryAndGetResponseDTO(Long blogId, Long categoryId, FolderCategoryUpdateDTO folderCategoryUpdateDTO, String email) {
        updateCategory(blogId, categoryId, folderCategoryUpdateDTO, email);

        FolderCategory folderCategory = folderCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new DataNotFoundException("카테고리를 찾을 수 없습니다."));

        return new FolderCategoryResponseDTO(folderCategory);
    }

    /**
     * 카테고리 삭제
     */
    @Transactional
    public void deleteCategory(Long blogId, Long categoryId, String email) {
        // 블로그 조회
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataNotFoundException("블로그를 찾을 수 없습니다."));

        // 권한 검사
        if (!blog.getMember().getEmail().equals(email)) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        // 카테고리 조회
        FolderCategory folderCategory = folderCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new DataNotFoundException("카테고리를 찾을 수 없습니다."));

        // 카테고리가 해당 블로그에 속하는지 확인
        if (!folderCategory.getBlog().getId().equals(blogId)) {
            throw new AccessDeniedException("해당 블로그의 카테고리가 아닙니다.");
        }

        // 기본 카테고리는 삭제 불가능
        if (folderCategory.getName().equals("기본 카테고리")) {
            throw new IllegalArgumentException("기본 카테고리는 삭제할 수 없습니다.");
        }

        // 카테고리에 속한 폴더가 있는지 확인
        if (!folderCategory.getFolderList().isEmpty()) {
            // 폴더가 있는 경우 기본 카테고리로 이동
            FolderCategory defaultCategory = folderCategoryRepository.findByBlogIdAndName(blogId, "기본 카테고리")
                    .orElseThrow(() -> new DataNotFoundException("기본 카테고리를 찾을 수 없습니다."));

            folderCategory.getFolderList().forEach(folder -> {
                folder.setCategory(defaultCategory);
                defaultCategory.getFolderList().add(folder);
            });
        }

        // 카테고리 삭제
        folderCategoryRepository.delete(folderCategory);
    }

    /**
     * 카테고리 ID로 카테고리 조회
     * @param categoryId 카테고리 ID
     * @return 카테고리
     * @throws EntityNotFoundException 카테고리가 존재하지 않는 경우
     */
    public FolderCategory getCategoryById(Long categoryId) {
        return folderCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다. ID: " + categoryId));
    }
}
