package com.webproject.atari_game;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.webproject.entity")
public class AtariGameApplication {

	public static void main(String[] args) {
		SpringApplication.run(AtariGameApplication.class, args);
	}

}
