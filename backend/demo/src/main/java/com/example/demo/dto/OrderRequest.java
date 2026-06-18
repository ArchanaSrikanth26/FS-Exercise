package com.example.demo.dto;

import java.util.List;

// Payload sent from frontend when customer places an order
public class OrderRequest {

    private Long userId;
    private String customerName;
    private List<OrderItemDto> items;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }

    // nested DTO for each cart item
    public static class OrderItemDto {
        private Long productId;
        private String productName;
        private String productImage;
        private Double price;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getProductImage() { return productImage; }
        public void setProductImage(String productImage) { this.productImage = productImage; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

}
