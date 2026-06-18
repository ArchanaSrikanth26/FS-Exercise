package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequest;
import com.example.demo.model.User;
import com.example.demo.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176"
})
public class AuthController {

    @Autowired
    private AuthService authService;

    // POST /auth/signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(
        @RequestBody User user
    ) {
        return authService.signup(user);
    }

    // POST /auth/login - returns LoginResponse with role
    @PostMapping("/login")
    public ResponseEntity<?> login(
        @RequestBody LoginRequest req
    ) {
        return authService.login(req);
    }

}
