package com.sesac.itall.domain.post;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.folder.Folder;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(name = "post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "VARCHAR", nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime regdate;

    @Column
    private LocalDateTime modifydate;

    @Column
    private LocalDateTime draftdate;

    @Column(name = "is_draft")
    private boolean draft;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id", nullable = false)
    private Blog blog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id", nullable = false)
    private Folder folder;

    // 엔티티 생성 시 자동으로 등록 날짜 설정
    @PrePersist
    protected void onCreate() {
        if (this.regdate == null) {
            this.regdate = LocalDateTime.now();
        }
        if (this.draft && this.draftdate == null) {
            this.draftdate = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.modifydate = LocalDateTime.now();
    }

    @Builder
    public Post(String title, String content, boolean draft, Blog blog, Folder folder) {
        this.title = title;
        this.content = content;
        this.draft = draft;
        this.blog = blog;
        this.folder = folder;
        this.regdate = LocalDateTime.now();

        // 초안인 경우 초안 날짜 설정
        if (draft) {
            this.draftdate = LocalDateTime.now();
        }
    }

}
