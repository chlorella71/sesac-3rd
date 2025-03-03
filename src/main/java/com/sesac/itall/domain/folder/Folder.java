package com.sesac.itall.domain.folder;

import com.sesac.itall.domain.folder_category.FolderCategory;
import com.sesac.itall.domain.post.Post;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.xml.crypto.dsig.spec.XSLTTransformParameterSpec;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(name = "folder")
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "VARCHAR",nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime regdate;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> post = new ArrayList<>();

    // 부모-자식 폴더 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Folder parentFolder;

    @OneToMany(mappedBy = "parentFolder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Folder> childFolderList = new ArrayList<>();

    // 폴더 카테고리와의 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private FolderCategory folderCategory;

    // 생성자
    public Folder(String name, FolderCategory folderCategory) {
        this.name = name;
        this.folderCategory = folderCategory;
        this.regdate = LocalDateTime.now();
    }

    // 카테고리 설정 메서드
    public void setCategory(FolderCategory folderCategory) {
        this.folderCategory = folderCategory;
    }

    // 부모 폴더 설정 메서드
    public void setParentFolder(Folder parentFolder) {
        this.parentFolder = parentFolder;
    }

    // 자식 폴더 추가 메서드
    public void addChildFolder(Folder childFolder) {
        this.childFolderList.add(childFolder);
        childFolder.setParentFolder(this);
    }

}
