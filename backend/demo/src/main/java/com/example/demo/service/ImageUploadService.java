package com.example.demo.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageUploadService {

    // reads app.upload.dir from application.properties
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public String save(MultipartFile file) throws IOException {

        // create the uploads folder if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // give file a unique name to avoid collisions
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;

        // save file to disk
        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        // return the public URL the frontend will use to display the image
        return "http://localhost:8084/uploads/" + fileName;
    }

}
