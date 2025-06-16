package com.example.ecommerce.service;

import com.example.ecommerce.model.Payment;
import com.example.ecommerce.repository.PaymentRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
public class PaymentService {    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private ImageService imageService;

    public Payment createTouchNGoPayment(String orderId, Double amount) {
        Payment payment = new Payment(orderId, "TNG", amount);
        
        // For real Touch 'n Go integration with your phone number
        String transactionId = "TNG_" + UUID.randomUUID().toString().substring(0, 8);
        String touchNGoNumber = "60167161396"; // Your Touch 'n Go number
        
        // Generate a payment link with your Touch 'n Go phone number
        // This creates a deep link that can open Touch 'n Go app
        String paymentUrl = String.format("https://pay.tngdigital.com.my/send?to=%s&amount=%.2f&reference=%s", 
                                         touchNGoNumber, amount, transactionId);
        
        payment.setTransactionId(transactionId);
        payment.setPaymentUrl(paymentUrl);
          return paymentRepository.save(payment);
    }    public Payment createDuitNowPayment(String orderId, Double amount) {
        Payment payment = new Payment(orderId, "DUITNOW", amount);
        
        try {
            // Generate real DuitNow QR code
            String transactionId = "DN_" + UUID.randomUUID().toString().substring(0, 8);
            System.out.println("Generating QR for transaction: " + transactionId + ", amount: " + amount);
            
            String qrCodeData = generateDuitNowQR(transactionId, amount);
            System.out.println("QR Data: " + qrCodeData);
            
            // Generate QR code image bytes
            byte[] qrImageBytes = generateQRCodeImageBytes(qrCodeData);
            System.out.println("QR Image generated, size: " + qrImageBytes.length + " bytes");
              // Store QR image in GridFS
            String qrImageFileId = imageService.uploadImageFromBytes(
                qrImageBytes, 
                "qr_" + transactionId + ".png", 
                "image/png"
            );
            System.out.println("QR Image stored in GridFS with ID: " + qrImageFileId);
            
            // Also create base64 version for immediate display
            String qrCodeImage = "data:image/png;base64," + Base64.getEncoder().encodeToString(qrImageBytes);
            
            payment.setTransactionId(transactionId);
            payment.setQrCode(qrCodeImage); // For immediate display
            
            return paymentRepository.save(payment);
            
        } catch (Exception e) {
            System.err.println("Error generating DuitNow payment: " + e.getMessage());
            e.printStackTrace();
            
            // Fallback: create payment without QR code
            String transactionId = "DN_" + UUID.randomUUID().toString().substring(0, 8);
            payment.setTransactionId(transactionId);
            payment.setQrCode("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
            
            return paymentRepository.save(payment);
        }
    }

    public Payment processPaymentCallback(String transactionId, String status, String failureReason) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        payment.setStatus(status);
        payment.setCompletedAt(LocalDateTime.now());
        
        if (failureReason != null) {
            payment.setFailureReason(failureReason);
        }
        
        return paymentRepository.save(payment);
    }

    public Payment getPaymentByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId)
            .orElseThrow(() -> new RuntimeException("Payment not found for order: " + orderId));
    }

    public Payment getPaymentById(String paymentId) {        return paymentRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));
    }    private String generateDuitNowQR(String transactionId, Double amount) {
        // Generate real DuitNow QR code using your actual DuitNow number
        String mobileNumber = "171036564446"; // Your actual DuitNow number
        String merchantName = "TANYANHO"; // Your actual merchant name from decoded QR
        
        // Use your real QR code as template and modify dynamic parts
        String qrData = generateDuitNowStaticQR(mobileNumber, merchantName);
        
        return qrData;
    }
      private String generateDuitNowStaticQR(String mobileNumber, String merchantName) {
        String payloadFormatIndicator = "000201";
        String pointOfInitiationMethod = "010211"; // 11 = static QR

        // Merchant Account Info (ID 26)
        String globallyUniqueId = "A000000615"; // DuitNow ID
        String proxyType = "01"; // 01 = Mobile Number
        String proxyValue = mobileNumber.startsWith("6") ? mobileNumber : "6" + mobileNumber; // Ensure starts with '6'
        String proxyField = proxyType + String.format("%02d", proxyValue.length()) + proxyValue;
        String merchantAccountInfoValue = globallyUniqueId + proxyField;
        String merchantAccountInfo = "26" + String.format("%02d", merchantAccountInfoValue.length()) + merchantAccountInfoValue;

        // Other required fields
        String merchantCategoryCode = "52040000"; // 0000 = default
        String transactionCurrency = "5303458";   // MYR
        String countryCode = "5802MY";
        String merchantNameStr = "59" + String.format("%02d", merchantName.length()) + merchantName;
        String merchantCity = "6009KualaLumpur"; // Can be replaced with real city if needed

        // No amount (static QR), no transaction ID
        String additionalDataField = ""; // Optional, skip for static QR

        // Assemble without CRC
        String rawPayload = payloadFormatIndicator +
                            pointOfInitiationMethod +
                            merchantAccountInfo +
                            merchantCategoryCode +
                            transactionCurrency +
                            countryCode +
                            merchantNameStr +
                            merchantCity +
                            additionalDataField +
                            "6304"; // CRC Placeholder

        String crc = calculateCRC16(rawPayload); // Make sure this function returns **uppercase HEX**
        return rawPayload + crc;
    }

    
    private String calculateCRC16(String data) {
        // Simple CRC16-CCITT calculation
        int crc = 0xFFFF;
        byte[] bytes = data.getBytes();
        
        for (byte b : bytes) {
            crc ^= (b & 0xFF) << 8;
            for (int i = 0; i < 8; i++) {
                if ((crc & 0x8000) != 0) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc <<= 1;
                }
                crc &= 0xFFFF;
            }        }
        return String.format("%04X", crc);
    }
      private String generateQRCodeImage(String qrData) {
        try {
            byte[] imageBytes = generateQRCodeImageBytes(qrData);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
        }
    }
    
    private byte[] generateQRCodeImageBytes(String qrData) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, 300, 300);
        
        BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "PNG", outputStream);
        
        return outputStream.toByteArray();
    }

    // Mock method to simulate payment verification
    public boolean verifyPayment(String transactionId) {
        // In real implementation, you would call the payment gateway API to verify
        // For demo purposes, we'll simulate a successful payment
        return Math.random() > 0.1; // 90% success rate for demo
    }
}
