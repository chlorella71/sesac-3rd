package com.sesac.itall.domain.folder_category;

import com.sesac.itall.domain.folder.Folder;
import com.sesac.itall.domain.folder.FolderResponseDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class FolderCategoryResponseDTO {

    private Long id;
    private String name;
//    private LocalDateTime regdate;
    private Long blogId;
    private long folderCount;
    private long postCount;
    private List<FolderResponseDTO> foderResponseDTOList = new ArrayList<>();


    // Entity를 DTO로 변환하는 생성자
    public FolderCategoryResponseDTO(FolderCategory folderCategory) {
        this.id = folderCategory.getId();
        this.name = folderCategory.getName();
        this.blogId = folderCategory.getBlog().getId();
        this.folderCount = folderCategory.getFolderList().size();

        // 폴더 정보와 포스트 개수 계산
        this.foderResponseDTOList = folderCategory.getFolderList().stream()
                // .map(FolderResponseDTO::new)
                .map(folder -> {
                    FolderResponseDTO folderResponseDTO = new FolderResponseDTO(folder);
                    return folderResponseDTO;
                })
                .collect(Collectors.toList());

        // 모든 폴더의 포스트 수 합산
        this.postCount = this.foderResponseDTOList.stream()
                .mapToLong(FolderResponseDTO::getPostCount)
                .sum();
    }
}
