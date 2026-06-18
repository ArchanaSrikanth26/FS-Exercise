package com.example.demo.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.service.ImageUploadService;

@RestController
@RequestMapping("/upload")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176"
})
public class ImageUploadController {

    @Autowired
    private ImageUploadService uploadService;

    // POST /upload/image  (multipart/form-data, field name = "file")
    // Returns the public URL of the saved image
    @PostMapping("/image")
    public String uploadImage(
        @RequestParam("file") MultipartFile file
    ) throws IOException {
        return uploadService.save(file);
    }

}
