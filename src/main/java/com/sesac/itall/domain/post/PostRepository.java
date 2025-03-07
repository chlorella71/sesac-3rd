package com.sesac.itall.domain.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 블로그에 속한 모든 게시물 조회 (초안 제외)
    List<Post> findByBlogIdAndDraftIsFalseOrderByRegdateDesc(Long blogId);

    // 페이징된 블로그 게시물 조회 (초안 제외)
    Page<Post> findByBlogIdAndDraftIsFalse(Long blogId, Pageable pageable);

    // 특정 폴더의 게시물 조회 (초안 제외)
    List<Post> findByFolderIdAndDraftIsFalseOrderByRegdateDesc(Long folderId);

    // 특정 카테고리의 게시물 조회 (초안 제외)
    @Query("SELECT p FROM Post p JOIN p.folder f WHERE f.folderCategory.id = :categoryId AND p.draft = false ORDER BY p.regdate DESC")
    List<Post> findPostsByCategoryId(@Param("categoryId") Long categoryId);

    // 특정 블로그의 모든 초안 조회
    List<Post> findByBlogIdAndDraftIsTrueOrderByDraftdateDesc(Long blogId);

    // 최근 게시물 n개 조회
    List<Post> findTop5ByBlogIdAndDraftIsFalseOrderByRegdateDesc(Long blogId);
}
