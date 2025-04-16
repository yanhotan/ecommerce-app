package com.example.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private List<OrderItem> items;
    private Double total;
    private String status;

    // Constructors
    public Order() {}

    public Order(List<OrderItem> items, Double total, String status) {
        this.items = items;
        this.total = total;
        this.status = status;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}