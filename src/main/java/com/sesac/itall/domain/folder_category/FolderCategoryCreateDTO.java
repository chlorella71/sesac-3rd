package com.sesac.itall.domain.folder_category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FolderCategoryCreateDTO {

    @NotBlank(message = "카테고리 이름은 필수입니다.")
    @Size(min = 2, max = 50, message = "카테고리 이름은 2-50자 사이여야 합니다.")
    private String name;

//    // 설명 필드
//    private String description;
}
