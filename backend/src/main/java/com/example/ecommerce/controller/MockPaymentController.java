package com.example.ecommerce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/mock-payment")
public class MockPaymentController {

    @GetMapping("/touchngo")
    public String touchNGoPayment(@RequestParam("transaction_id") String transactionId, Model model) {
        model.addAttribute("transactionId", transactionId);
        model.addAttribute("paymentMethod", "Touch 'n Go");
        return "mock-payment";
    }

    @GetMapping("/duitnow")
    public String duitNowPayment(@RequestParam("transaction_id") String transactionId, Model model) {
        model.addAttribute("transactionId", transactionId);
        model.addAttribute("paymentMethod", "DuitNow");
        return "mock-payment";
    }
}
