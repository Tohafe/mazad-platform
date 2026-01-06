package com.mazad.auth.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/")
public class TestController {
    @GetMapping
    public String test(@RequestParam String param) {
        return "Test Controller Works Fine";
    }
    
}
