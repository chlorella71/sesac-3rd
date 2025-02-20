package com.sesac.itall.domain.question;

import com.sesac.itall.domain.answer.AnswerResponseDTO;
import lombok.Getter;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class QuestionResponseDTO {

    private Long id;
    private String title;
    private String content;
    private String formattedRegdate;
    private String formattedModifydate;
    private String nickname;  // 작성자 정보 추가
    private String email;
    private List<AnswerResponseDTO> answerList; // AnswerResponseDTO 리스트로 변경
    private Long categoryId;

    public QuestionResponseDTO(Question question) {
        this.id= question.getId();
        this.title= question.getTitle();
        this.content= question.getContent();
        this.formattedRegdate= formattedDate(question.getRegdate());
        this.formattedModifydate= (question.getModifydate() != null) ? formattedDate(question.getModifydate()) : "";
        this.nickname = (question.getMember() != null) ? question.getMember().getNickname() : "익명";    // 작성자 닉네임 설정
        this.email = (question.getMember() != null) ? question.getMember().getEmail() : "익명";
        this.categoryId = (question.getCategory() != null) ? question.getCategory().getId() : 1;

        // Answer 리스트를 AnswerResponseDTO 리스트로 변환하여 저장
        this.answerList = question.getAnswerList().stream()
                .map(AnswerResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 원래는 dto 내부에서만 사용하는 유틸리티 메서드이므로 private 접근제어자를 사용해야함
    public static String formattedDate(LocalDateTime localDateTime) {

        if (localDateTime == null) {
            return "날짜 없음";
        }

        // 한국 시간대 적용
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        Duration duration = Duration.between(localDateTime, now);
        long minutes = duration.toMinutes();    // 경과 시간(분)
        long hours = duration.toHours();    // 경과 시간(시간)

        // 한국 시간 기준으로 변환 (타임존 문제 해결)
//        ZonedDateTime regdateTime= date.toInstant()
//                .atZone(ZoneId.of("Asia/Seoul"));
//        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
//
//        Duration duration= Duration.between(regdateTime, now);
//        long hours= duration.toHours(); // 경과 시간(시간)
//        long minutes = duration.toMinutes();    // 경과 시간(분)

        if (minutes < 5) {
            return "방금 전";
        } else if (minutes < 60) {
            return minutes + "분 전"; // 1시간 이내
        } else if (hours < 24) {
            return hours + "시간 전";  // 24시간 이내라면 "n시간 전"
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return localDateTime.format(formatter);  // 24시간 이후라면 "yyyy-MM-dd"
        }
    }
}
