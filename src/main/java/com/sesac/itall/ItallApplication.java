package com.sesac.itall;

import com.sesac.itall.domain.question.QuestionResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Date;

@SpringBootApplication
@Slf4j	// Lombok이 자동으로 log 객체를 생성
public class ItallApplication {

	public static void main(String[] args) {
		SpringApplication.run(ItallApplication.class, args);

		Date now = new Date(); // 현재 시간
		String formattedDate = QuestionResponseDTO.formattedRegdate(now);
		log.info("현재 시간의 포맷된 값: {}", formattedDate);	// 예상: "방금 전"
	}
}
