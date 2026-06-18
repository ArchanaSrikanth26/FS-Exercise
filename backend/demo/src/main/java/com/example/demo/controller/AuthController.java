package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.User;
import com.example.demo.services.UserService;

@RestController
@RequestMapping("/auth")

@CrossOrigin(
origins = {
"http://localhost:5173",
"http://localhost:5174"
}
)

public class AuthController {

@Autowired
private UserService service;

@PostMapping("/signup")
public String signup(
@RequestBody User user
){
return service.signup(user);
}

@PostMapping("/login")
public String login(
@RequestBody User user
){
return service.login(user);
}

}
