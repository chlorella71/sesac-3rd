package com.sesac.itall.domain.blog;

import com.sesac.itall.domain.folder_category.FolderCategory;
import com.sesac.itall.domain.member.Member;
import com.sesac.itall.domain.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BlogService {

    private final BlogRepository blogRepository;
    private final MemberRepository memberRepository;

    /**
     *  로그인한 멤버가 블로그를 생성하는 메서드
     *  @param email 블로그를 생성할 멤버의 email
     *  @param title 블로그 제목
     *  @param intro 블로그 소개
     *  @return 생성된 블로그 엔티티
     *  @throws IllegalArgumentException 멤버를 찾을 수 없거나 이미 블로그가 존재하는 경우*
     */

    @Transactional
    public Blog createBlog(String email, String title, String intro) {
        // 1. 멤버 조회
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 멤버를 찾을 수 없습니다. email: " + email));

        // 2. 이미 블로그가 존재하는지 확인
        if (blogRepository.existsByMember(member)) {
            throw new IllegalArgumentException("이미 블로그가 존재합니다.");
        }

        // 3. 블로그 생성
        Blog blog = new Blog(title, intro, member);

        // 4. 기본 폴더 카테고리 생성
        FolderCategory folderCategory = createDefaultCategory(blog);
        blog.addCategory(folderCategory);

        // 5. 블로그 저장
        return blogRepository.save(blog);
    }

    /**
     * 블로그 생성 시 기본 카테고리를 생성하는 메서드
     *
     * @param blog 기본 카테고리를 추가할 블로그
     * @return 생성된 기본 카테고리
     */
    private FolderCategory createDefaultCategory(Blog blog) {
        FolderCategory folderCategory = new FolderCategory();
        folderCategory.setName("기본 카테고리");
        folderCategory.setBlog(blog);
        folderCategory.setRegdate(LocalDateTime.now());
        return folderCategory;
    }

    /**
     * 블로그 정보를 수정하는 메서드
     *
     * @param blogId 수정할 블로그 ID
     * @param title 새로운 블로그 제목
     * @param intro 새로운 블로그 소개
     * @return 수정된 블로그 엔티티
     */
    @Transactional
    public Blog updateBlog(Long blogId, String title, String intro) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new IllegalArgumentException("해당 블로그를 찾을 수 없습니다. blogId: " + blogId));

        // 제목과 소개 업데이트
        blog.updateBlogInfo(title, intro);

        return blog;
    }

    // 모든 블로그 조회
    public List<BlogResponseDTO> getAllBlogs() {

        return blogRepository.findAll().stream()
                .map(BlogResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 회원 이메일로 블로그 찾기
    public Optional<Blog> findBlogByEmail(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));

        return blogRepository.findByMember(member);
    }

    // 블로그 생성
    public Blog createBlog(String email, BlogCreateDTO blogCreateDTO) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));

        // 이미 블로그가 존재하는지 확인
        if (blogRepository.existsByMember(member)) {
            throw new RuntimeException("이미 블로그가 존재합니다.");
        }

        Blog blog = new Blog(blogCreateDTO.getTitle(), blogCreateDTO.getIntro(), member);
        return blogRepository.save(blog);
    }

    // 블로그 상세
    public Blog getBlogById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 블로그가 존재하지 않습니다. ID: " + id));
    }
}
