package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.OrderRequest;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    OrderRepository orderRepo;

    public Order placeOrder(OrderRequest req) {

        // build order entity
        Order order = new Order();
        order.setUserId(req.getUserId());
        order.setCustomerName(req.getCustomerName());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");

        // map each cart item DTO to an OrderItem entity
        List<OrderItem> items = req.getItems().stream().map(dto -> {
            OrderItem item = new OrderItem();
            item.setProductId(dto.getProductId());
            item.setProductName(dto.getProductName());
            item.setProductImage(dto.getProductImage());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());
            return item;
        }).collect(Collectors.toList());

        order.setItems(items);

        // calculate total
        double total = items.stream()
            .mapToDouble(i -> i.getPrice() * i.getQuantity())
            .sum();
        order.setTotalAmount(total);

        return orderRepo.save(order);
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepo.findByUserIdOrderByOrderDateDesc(userId);
    }

}
