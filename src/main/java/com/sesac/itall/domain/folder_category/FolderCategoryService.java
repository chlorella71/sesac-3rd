package com.sesac.itall.domain.folder_category;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.blog.BlogRepository;
import com.sesac.itall.domain.common.DataNotFoundException;
import com.sesac.itall.domain.folder.Folder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

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
}
