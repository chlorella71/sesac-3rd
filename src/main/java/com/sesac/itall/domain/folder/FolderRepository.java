package com.sesac.itall.domain.folder;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {

    /**
     * 카테고리 ID로 최상위 폴더 목록 조회 (부모 폴더가 없는 폴더들)
     * @param categoryId 카테고리 ID
     * @return 폴더 목록
     */
    List<Folder> findByFolderCategoryIdAndParentFolderIsNull(Long categoryId);

    /**
     * 카테고리 ID로 모든 폴더 조회
     * @param categoryId 카테고리 ID
     * @return 폴더 목록
     */
    List<Folder> findByFolderCategoryId(Long categoryId);

    /**
     * 부모 폴더 ID로 하위 폴더 목록 조회
     * @param parentFolderId 부모 폴더 ID
     * @return 폴더 목록
     */
    List<Folder> findByParentFolderId(Long parentFolderId);
}
