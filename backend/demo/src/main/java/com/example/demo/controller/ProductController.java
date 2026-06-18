package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176"
})
public class ProductController {

    @Autowired
    private ProductService productService;

    // GET all products - used by both admin and customer
    @GetMapping
    public List<Product> getAll() {
        return productService.getAll();
    }

    // POST add product - admin only
    @PostMapping
    public Product addProduct(
        @RequestBody Product product
    ) {
        return productService.addProduct(product);
    }

    // PUT update product - admin only
    @PutMapping("/{id}")
    public String updateProduct(
        @PathVariable Long id,
        @RequestBody Product product
    ) {
        return productService.updateProduct(id, product);
    }

    // DELETE product - admin only
    @DeleteMapping("/{id}")
    public String deleteProduct(
        @PathVariable Long id
    ) {
        return productService.deleteProduct(id);
    }

    // GET filter by category
    @GetMapping("/filter")
    public List<Product> filterByCategory(
        @RequestParam String category
    ) {
        return productService.filterByCategory(category);
    }

    // GET search by name
    @GetMapping("/search")
    public List<Product> searchByName(
        @RequestParam String name
    ) {
        return productService.searchByName(name);
    }

}
