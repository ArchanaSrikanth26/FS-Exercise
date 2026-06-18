package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.OrderRequest;
import com.example.demo.model.Order;
import com.example.demo.service.OrderService;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176"
})
public class OrderController {

    @Autowired
    private OrderService orderService;

    // POST /orders - place a new order
    @PostMapping
    public Order placeOrder(
        @RequestBody OrderRequest req
    ) {
        return orderService.placeOrder(req);
    }

    // GET /orders/user/{userId} - get order history for a customer
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(
        @PathVariable Long userId
    ) {
        return orderService.getOrdersByUser(userId);
    }

}
