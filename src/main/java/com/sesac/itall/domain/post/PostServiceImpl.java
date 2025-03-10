package com.sesac.itall.domain.post;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.blog.BlogRepository;
import com.sesac.itall.domain.common.DataNotFoundException;
import com.sesac.itall.domain.folder.Folder;
import com.sesac.itall.domain.folder.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final BlogRepository blogRepository;
    private final FolderRepository folderRepository;

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

        return postRepository.save(post);
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
}