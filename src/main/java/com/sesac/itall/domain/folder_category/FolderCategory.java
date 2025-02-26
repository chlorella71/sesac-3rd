package com.sesac.itall.domain.folder_category;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.folder.Folder;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "folder_category")
public class FolderCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime regdate;

    // 카테고리가 속한 블로그
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id", nullable = false)
    private Blog blog;

    // 카테고리에 속한 폴더들
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Folder> folderList = new ArrayList<>();
}
