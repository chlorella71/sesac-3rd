package com.sesac.itall.domain.folder_category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
//@AllArgsConstructor
public class FolderCategoryUpdateDTO {

//    @NotNull(message = "id는 필수 값입니다.")
//    private Long id;

    @NotBlank(message= "카테고리 이름은 필수입니다.")
    @Size(min = 2, max = 50, message = "카테고리 이름은 2-50자 사이여야 합니다.")
    private String name;

//    @NotNull(message = "블로그 id는 필수 값입니다.")
//    private Long blogId;
}
