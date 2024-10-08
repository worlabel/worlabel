package com.worlabel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class WorLabelApplication {

	public static void main(String[] args) {
//		// EC2 스프링 서버 설정을 위해 추가
//		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
		SpringApplication.run(WorLabelApplication.class, args);
	}
}
