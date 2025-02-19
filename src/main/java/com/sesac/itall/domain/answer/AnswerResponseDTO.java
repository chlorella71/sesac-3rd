package com.sesac.itall.domain.answer;

import lombok.Getter;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;

@Getter
public class AnswerResponseDTO {

    private Long id;
    private String content;
    private String formattedRegdate;
    private String nickname;    // 작성자 정보 추가
    private Long questionId;    // 질문 ID 추가

    public AnswerResponseDTO(Answer answer) {
        this.id = answer.getId();
        this.content = answer.getContent();
        this.formattedRegdate = (answer.getRegdate() != null) ? formattedRegdate(answer.getRegdate()) : "날짜 없음";
        this.nickname = (answer.getMember() != null) ? answer.getMember().getNickname() : "익명"; //  작성자 닉네임 실정
        this.questionId = answer.getQuestion().getId(); // 어떤 질문에 달린 답변인지 알기 위해 추가
    }

    public static String formattedRegdate(Date date) {
        if (date == null) {
            return "날짜 없음";
        }

        // 한국 시간 기준으로 변환
        ZonedDateTime regdateTime = date.toInstant().atZone(ZoneId.of("Asia/Seoul"));
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));

        Duration duration = Duration.between(regdateTime, now);
        long hours = duration.toHours();
        long minutes = duration.toMinutes();

        if ( minutes < 5 ) {
            return "방금 전";
        } else if (minutes < 60) {
            return minutes + "분 전";     // 1시간 이내
        } else if (hours < 24) {
            return hours + "시간 전";  // 24시간 이내라면 "n시간 전"
        } else {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            return formatter.format(date);  // 24시간 이후라면 "yyyy-MM-dd"
        }
    }
}
