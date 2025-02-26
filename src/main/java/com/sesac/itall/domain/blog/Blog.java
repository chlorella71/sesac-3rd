package com.sesac.itall.domain.blog;

import com.sesac.itall.domain.folder_category.FolderCategory;
import com.sesac.itall.domain.member.Member;
import com.sesac.itall.domain.post.Post;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "blog")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "VARCHAR", nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String intro;

    @Column(nullable = false, updatable = false)
    private LocalDateTime regdate;

    @Column
    private LocalDateTime modifydate;

    // 블로그의 포스트 목록
    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> postList = new ArrayList<>();

    // 블로그 소유자
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 블로그 폴더 카테고리 목록
    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FolderCategory> folderCategoryList = new ArrayList<>();

    // 생성자
    public Blog(String title, String intro, Member member) {
        this.title = title;
        this.intro = intro;
        this.member = member;
        this.regdate = LocalDateTime.now();
//        this.postList = new ArrayList<>();
//        this.folderCategoryList = new ArrayList<>();
    }

    // 정적 팩토리 메서드
    public static Blog createBlog(String title, String intro, Member member) {
        return new Blog(title, intro, member);
    }

    // 도메인 로직을 통한 카테고리 추가 메서드
    public void addCategory(FolderCategory folderCategory) {
//        if (this.folderCategoryList == null) {
//            this.folderCategoryList = new ArrayList<>();
//        }
        this.folderCategoryList.add(folderCategory);
        folderCategory.setBlog(this);
    }

    // 블로그 정보 업데이트 메서드
    public void updateBlogInfo(String title, String intro) {
        this.title = title;
        this.intro = intro;
        this.modifydate = LocalDateTime.now();
    }

    // 게시물 추가 메서드
    public void addPost(Post post) {
//        if (this.postList == null) {
//            this.postList = new ArrayList<>();
//        }
        this.postList.add(post);
        post.setBlog(this);
    }
}
