package com.sesac.itall.domain.folder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FolderUpdateDTO {

    @NotBlank(message = "폴더 이름은 필수입니다.")
    @Size(min = 2, max = 50, message = "폴더 이름은 2-50자 사이여야 합니다.")
    private String name;
}
