package com.example.ecommerce.repository;

import com.example.ecommerce.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByOrderId(String orderId);
    List<Payment> findByStatus(String status);
    Optional<Payment> findByTransactionId(String transactionId);
}
