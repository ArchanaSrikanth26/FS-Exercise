package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    ProductRepository productRepo;

    public List<Product> getAll() {
        return productRepo.findAll();
    }

    public Product addProduct(Product product) {
        return productRepo.save(product);
    }

    public String updateProduct(Long id, Product updated) {

        Optional<Product> existing = productRepo.findById(id);

        if (existing.isEmpty()) {
            return "Product not found";
        }

        Product p = existing.get();
        p.setName(updated.getName());
        p.setDescription(updated.getDescription());
        p.setPrice(updated.getPrice());
        p.setCategory(updated.getCategory());
        p.setImageUrl(updated.getImageUrl());
        p.setStock(updated.getStock());

        productRepo.save(p);
        return "Product updated successfully";
    }

    public String deleteProduct(Long id) {

        if (!productRepo.existsById(id)) {
            return "Product not found";
        }

        productRepo.deleteById(id);
        return "Product deleted successfully";
    }

    public List<Product> filterByCategory(String category) {
        return productRepo.findByCategoryIgnoreCase(category);
    }

    public List<Product> searchByName(String name) {
        return productRepo.findByNameContainingIgnoreCase(name);
    }

}
