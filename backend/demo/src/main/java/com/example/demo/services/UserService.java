package com.example.demo.services;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Service

public class UserService {

@Autowired
UserRepository repo;

public String signup(User user){

Optional<User> existing=
repo.findByEmail(user.getEmail());

if(existing.isPresent()){
return "Email already exists";
}

repo.save(user);

return "Signup Success";
}

public String login(User user){

Optional<User> existing=
repo.findByEmail(user.getEmail());

if(existing.isPresent()
&& existing.get().getPassword()
.equals(user.getPassword())){

return "Login Success";
}

return "Invalid Credentials";

}

}