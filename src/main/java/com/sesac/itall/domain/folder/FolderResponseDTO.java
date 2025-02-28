package com.sesac.itall.domain.folder;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class FolderResponseDTO {

    private Long id;
    private String name;
    private Long parentFolderId;
    private String parentFolderName;
    private long childFolderCount;
    private List<Long> childFolderIdList;
    private long postCount;
    private Long categoryId;
    private String categoryName;

    public FolderResponseDTO(Folder folder) {
        this.id = folder.getId();
        this.name = folder.getName();

        // 부모 폴더 정보
        if (folder.getParentFolder() != null) {
            this.parentFolderId = folder.getParentFolder().getId();
            this.parentFolderName = folder.getParentFolder().getName();
        }

        // 자식 폴더 정보
        this.childFolderCount = folder.getChildFolderList().size();
        this.childFolderIdList = folder.getChildFolderList().stream()
                .map(Folder::getId)
                .collect(Collectors.toList());

        // 포스트 정보
        this.postCount = folder.getPost().size();

        // 카테고리 정보
        if (folder.getFolderCategory() != null) {
            this.categoryId = folder.getFolderCategory().getId();
            this.categoryName = folder.getFolderCategory().getName();
        }
    }
}
