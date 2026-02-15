package com.mazad.chat_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChatServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatServiceApplication.class, args);
		System.out.println("====================================");
		System.out.println("Chat Service is running ...");
		System.out.println("====================================");



	}

}
