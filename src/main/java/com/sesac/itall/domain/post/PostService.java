package com.sesac.itall.domain.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostService {

    // 포스트 생성
    Post createPost(Long blogId, PostCreateDTO postCreateDTO, String email);

//    // 포스트 수정
//    Post updatePost(PostUpdateDTO postModifyDTO, String email);
//
//    // 포스트 삭제
//    void deletePost(Long postId, String email);
//
//    // 포스트 상세 조회
//    PostResponseDTO getPostById(Long postId);

    // 블로그 내 모든 포스트 조회 (초안 제외)
    List<PostResponseDTO> getPostsByBlogId(Long blogId);

//    // 페이징된 블로그 내 포스트 조회
//    Page<PostResponseDTO> getPostsByBlogId(Long blogId, Pageable pageable);

    // 폴더 내 포스트 조회
    List<PostResponseDTO> getPostsByFolderId(Long folderId);

    // 카테고리 내 포스트 조회
    List<PostResponseDTO> getPostsByCategoryId(Long categoryId);

//    // 초안 목록 조회
//    List<PostResponseDTO> getDraftsByBlogId(Long blogId, String email);
//
//    // 초안을 정식 게시물로 발행
//    Post publishDraft(Long postId, String email);
}
