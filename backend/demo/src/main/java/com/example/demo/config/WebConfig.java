package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // maps GET /uploads/** to files in the uploads/ folder on disk
        // so images saved by ImageUploadService are accessible via URL
        registry
            .addResourceHandler("/uploads/**")
            .addResourceLocations("file:" + uploadDir + "/");
    }

}
