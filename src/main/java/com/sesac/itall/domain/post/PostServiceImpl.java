package com.sesac.itall.domain.post;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.blog.BlogRepository;
import com.sesac.itall.domain.common.DataNotFoundException;
import com.sesac.itall.domain.folder.Folder;
import com.sesac.itall.domain.folder.FolderRepository;
import com.sesac.itall.domain.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final BlogRepository blogRepository;
    private final FolderRepository folderRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public Post createPost(Long blogId, PostCreateDTO postCreateDTO, String email) {

        // 블로그 조회
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataNotFoundException("블로그를 찾을 수 없습니다."));

        // 블로그 소유자 확인
        if (!blog.getMember().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "해당 블로그에 대한 권한이 없습니다.");
        }

        // 폴더 조회
        Folder folder = folderRepository.findById(postCreateDTO.getFolderId())
                .orElseThrow(() -> new DataNotFoundException("폴더를 찾을 수 없습니다."));

        // 폴더가 해당 블로그에 속하는지 확인
        if (!folder.getFolderCategory().getBlog().getId().equals(blogId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "해당 블로그의 폴더가 아닙니다.");
        }

        // Lombok의 @Builder 어노테이션을 활용한 포스트 생성
        Post post = Post.builder()
                .title(postCreateDTO.getTitle())
                .content(postCreateDTO.getContent())
                .draft(postCreateDTO.isDraft())
                .blog(blog)
                .folder(folder)
                .build();

        Post savedPost = postRepository.save(post);

        // 초안이 아닌 경우에만 알림 생성
        if (!savedPost.isDraft()) {
            notificationService.createPostNotifications(savedPost);
        }

        return savedPost;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponseDTO> getPostsByBlogId(Long blogId) {
        return postRepository.findByBlogIdAndDraftIsFalseOrderByRegdateDesc(blogId).stream()
                .map(PostResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponseDTO> getPostsByFolderId(Long folderId) {
        return postRepository.findByFolderIdAndDraftIsFalseOrderByRegdateDesc(folderId).stream()
                .map(PostResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponseDTO> getPostsByCategoryId(Long categoryId) {
        return postRepository.findPostsByCategoryId(categoryId).stream()
                .map(PostResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponseDTO getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new DataNotFoundException("포스트를 찾을 수 없습니다."));
        return new PostResponseDTO(post);
    }

    @Override
    @Transactional
    public PostResponseDTO updatePost(PostUpdateDTO postUpdateDTO, String email) {
        Post post = postRepository.findById(postUpdateDTO.getId())
                .orElseThrow(() -> new DataNotFoundException("포스트를 찾을 수 없습니다."));

        // 작성자 확인
        if (!post.getBlog().getMember().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다.");
        }

        // 폴더 변경 확인
        if (postUpdateDTO.getFolderId() != null && !post.getFolder().getId().equals(postUpdateDTO.getFolderId())) {
            Folder newFolder = folderRepository.findById(postUpdateDTO.getFolderId())
                    .orElseThrow(() -> new DataNotFoundException("폴더를 찾을 수 없습니다."));

            // 같은 블로그의 폴더인지 확인
            if (!newFolder.getFolderCategory().getBlog().getId().equals(post.getBlog().getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "해당 블로그의 폴더가 아닙니다.");
            }

            post.setFolder(newFolder);
        }

        // 내용 업데이트
        post.setTitle(postUpdateDTO.getTitle());
        post.setContent(postUpdateDTO.getContent());
        post.setDraft(postUpdateDTO.isDraft());

        Post updatedPost = postRepository.save(post);
        return new PostResponseDTO(updatedPost);
    }

    @Override
    @Transactional
    public void deletePost(Long postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new DataNotFoundException("포스트를 찾을 수 없습니다."));

        // 작성자 확인
        if (!post.getBlog().getMember().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제 권한이 없습니다.");
        }

        postRepository.delete(post);
    }

    // 초안 목록 조회
    @Override
    @Transactional(readOnly = true)
    public List<PostResponseDTO> getDraftsByBlogId(Long blogId, String email) {
        // 먼저 블로그 소유자 확인
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataNotFoundException("블로그를 찾을 수 없습니다."));

        // 블로그 소유자 확인
        if (!blog.getMember().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "접근 권한이 없습니다.");
        }

        // 초안 포스트 조회
        return postRepository.findByBlogIdAndDraftIsTrueOrderByDraftdateDesc(blogId).stream()
                .map(PostResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 초안 발행
    @Override
    @Transactional
    public Post publishDraft(Long postId, String email) {
        // 포스트 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new DataNotFoundException("포스트를 찾을 수 없습니다."));

        // 권한 확인 (포스트 작성자인지)
        if (!post.getBlog().getMember().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "발행 권한이 없습니다.");
        }

        // 초안인지 확인
        if (!post.isDraft()) {
            throw new IllegalStateException("이미 발행된 포스트입니다.");
        }

        // 초안 상태 해제 및 등록일 업데이트
        post.setDraft(false);
        post.setRegdate(LocalDateTime.now()); // 발행 시점으로 등록일 업데이트

        Post publishedPost = postRepository.save(post);

        // 발행 시 알림 생성
        notificationService.createPostNotifications(publishedPost);

        return publishedPost;
    }
}