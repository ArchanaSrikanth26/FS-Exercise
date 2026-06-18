package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // get all orders for a specific customer, newest first
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

}
