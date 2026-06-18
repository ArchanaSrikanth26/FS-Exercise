package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // filter by category
    List<Product> findByCategoryIgnoreCase(String category);

    // search by name (partial match)
    List<Product> findByNameContainingIgnoreCase(String name);

}
