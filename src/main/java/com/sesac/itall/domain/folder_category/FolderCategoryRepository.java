package com.sesac.itall.domain.folder_category;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderCategoryRepository extends JpaRepository<FolderCategory, Long> {

    List<FolderCategory> findByBlogId(Long blogId);
}
