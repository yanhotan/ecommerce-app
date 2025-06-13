package com.example.ecommerce.controller;

import com.example.ecommerce.model.Payment;
import com.example.ecommerce.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/touchngo")
    public ResponseEntity<Payment> createTouchNGoPayment(@RequestBody Map<String, Object> request) {
        try {
            String orderId = (String) request.get("orderId");
            Double amount = Double.valueOf(request.get("amount").toString());
            
            Payment payment = paymentService.createTouchNGoPayment(orderId, amount);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/duitnow")
    public ResponseEntity<Payment> createDuitNowPayment(@RequestBody Map<String, Object> request) {
        try {
            String orderId = (String) request.get("orderId");
            Double amount = Double.valueOf(request.get("amount").toString());
            
            Payment payment = paymentService.createDuitNowPayment(orderId, amount);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable String orderId) {
        try {
            Payment payment = paymentService.getPaymentByOrderId(orderId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable String paymentId) {
        try {
            Payment payment = paymentService.getPaymentById(paymentId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/callback")
    public ResponseEntity<String> paymentCallback(@RequestBody Map<String, Object> callbackData) {
        try {
            String transactionId = (String) callbackData.get("transactionId");
            String status = (String) callbackData.get("status");
            String failureReason = (String) callbackData.get("failureReason");
            
            paymentService.processPaymentCallback(transactionId, status, failureReason);
            return ResponseEntity.ok("Callback processed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process callback");
        }
    }

    @PostMapping("/verify/{transactionId}")
    public ResponseEntity<Map<String, Object>> verifyPayment(@PathVariable String transactionId) {
        try {
            boolean isVerified = paymentService.verifyPayment(transactionId);
            
            if (isVerified) {
                paymentService.processPaymentCallback(transactionId, "SUCCESS", null);
                return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "Payment verified successfully"
                ));
            } else {
                paymentService.processPaymentCallback(transactionId, "FAILED", "Payment verification failed");
                return ResponseEntity.ok(Map.of(
                    "status", "FAILED",
                    "message", "Payment verification failed"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "message", "Failed to verify payment"
            ));
        }
    }
}
