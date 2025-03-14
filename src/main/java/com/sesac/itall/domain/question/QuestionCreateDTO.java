package com.sesac.itall.domain.question;

import com.sesac.itall.domain.member.Member;
import com.sesac.itall.domain.question_category.QuestionCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Getter
@Setter
public class QuestionCreateDTO {

//    private String formattedRegdate;

    @NotBlank(message= "제목을 입력해주세요.")
    private String title;

    @NotBlank(message= "내용을 입력해주세요.")
    private String content;

    @NotNull(message="카테고리를 선택해주세요.")
    private Long categoryId;    // 카테고리 ID

}
