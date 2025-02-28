package com.sesac.itall.domain.folder_category;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FolderCategoryRepository extends JpaRepository<FolderCategory, Long> {

    /**
     * 블로그 Id로 모든 카테고리 조회
     * @param blogId
     * @return
     */
    List<FolderCategory> findByBlogId(Long blogId);

    Optional<FolderCategory> findByBlogIdAndName(Long blogId, String name);

}
