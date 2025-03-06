package com.sesac.itall;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(locations = "classpath:application.properties")	// 기본 설정 적용
class ItallApplicationTests {

	@Test
	void contextLoads() {
	}

}
