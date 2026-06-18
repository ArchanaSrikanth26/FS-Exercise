package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    UserRepository userRepo;

    public ResponseEntity<?> signup(User user) {

        // check if email already exists
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("Email already registered");
        }

        // default role to CUSTOMER if not provided
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("CUSTOMER");
        }

        userRepo.save(user);
        return ResponseEntity.ok("Signup successful");
    }

    public ResponseEntity<?> login(LoginRequest req) {

        Optional<User> found = userRepo.findByEmail(req.getEmail());

        if (found.isEmpty() || !found.get().getPassword().equals(req.getPassword())) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password");
        }

        User user = found.get();

        // return user info including role - frontend uses role to decide which dashboard to show
        LoginResponse response = new LoginResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            "Login successful"
        );

        return ResponseEntity.ok(response);
    }

}
