package com.sesac.itall.domain.answer;

import lombok.Getter;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Getter
public class AnswerResponseDTO {

    private Long id;
    private String content;
    private String formattedRegdate;
    private String formattedModifydate;
    private String nickname;    // 작성자 정보 추가
    private Long questionId;    // 질문 ID 추가
    private String email;

    public AnswerResponseDTO(Answer answer) {
        this.id = answer.getId();
        this.content = answer.getContent();
        this.formattedRegdate = (answer.getRegdate() != null) ? formattedDate(answer.getRegdate()) : "날짜 없음";
        this.formattedModifydate = (answer.getModifydate() != null) ? formattedDate(answer.getModifydate()) : "";
        this.nickname = (answer.getMember() != null) ? answer.getMember().getNickname() : "익명"; //  작성자 닉네임 설정
        this.questionId = answer.getQuestion().getId(); // 어떤 질문에 달린 답변인지 알기 위해 추가
        this.email = (answer.getMember() != null) ? answer.getMember().getEmail() : "익명";   // 작성자 이메일 설정
    }

    public static String formattedDate(LocalDateTime localDateTime) {
        if (localDateTime == null) {
            return "날짜 없음";
        }

        // 한국 시간대 적용
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        Duration duration = Duration.between(localDateTime, now);
        long minutes = duration.toMinutes();
        long hours = duration.toHours();

        if ( minutes < 5 ) {
            return "방금 전";
        } else if (minutes < 60) {
            return minutes + "분 전";     // 1시간 이내
        } else if (hours < 24) {
            return hours + "시간 전";  // 24시간 이내라면 "n시간 전"
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return localDateTime.format(formatter);  // 24시간 이후라면 "yyyy-MM-dd"
        }
    }
}
