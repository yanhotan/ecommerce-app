package com.example.ecommerce.controller;

import com.example.ecommerce.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:3000")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate file
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "Please select a file to upload");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("success", false);
                response.put("message", "Please upload a valid image file");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Upload to GridFS
            String fileId = imageService.uploadImage(file);
            
            response.put("success", true);
            response.put("message", "Image uploaded successfully");
            response.put("fileId", fileId);
            response.put("filename", file.getOriginalFilename());
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/upload-local")
    public ResponseEntity<Map<String, Object>> uploadLocalImage(@RequestParam("filePath") String filePath) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Path path = Paths.get(filePath);
            
            if (!Files.exists(path)) {
                response.put("success", false);
                response.put("message", "File not found: " + filePath);
                return ResponseEntity.badRequest().body(response);
            }
            
            // Read file bytes
            byte[] imageBytes = Files.readAllBytes(path);
            String filename = path.getFileName().toString();
            
            // Determine content type based on file extension
            String contentType = getContentType(filename);
            
            // Upload to GridFS
            String fileId = imageService.uploadImageFromBytes(imageBytes, filename, contentType);
            
            response.put("success", true);
            response.put("message", "Local image uploaded successfully");
            response.put("fileId", fileId);
            response.put("filename", filename);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "Failed to upload local image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/upload-base64")
    public ResponseEntity<Map<String, Object>> uploadBase64Image(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String base64Data = request.get("imageData");
            String filename = request.get("filename");
            
            if (base64Data == null || base64Data.isEmpty()) {
                response.put("success", false);
                response.put("message", "Image data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Remove data URL prefix if present
            if (base64Data.startsWith("data:")) {
                base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
            }
            
            // Decode base64
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);
            
            // Determine content type
            String contentType = filename != null ? getContentType(filename) : "image/png";
            String finalFilename = filename != null ? filename : "uploaded_image.png";
            
            // Upload to GridFS
            String fileId = imageService.uploadImageFromBytes(imageBytes, finalFilename, contentType);
            
            response.put("success", true);
            response.put("message", "Base64 image uploaded successfully");
            response.put("fileId", fileId);
            response.put("filename", finalFilename);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to upload base64 image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<byte[]> getImage(@PathVariable String fileId) {
        try {
            byte[] imageBytes = imageService.getImageBytes(fileId);
            
            if (imageBytes == null) {
                return ResponseEntity.notFound().build();
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG); // Default to PNG
            
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{fileId}/base64")
    public ResponseEntity<Map<String, String>> getImageAsBase64(@PathVariable String fileId) {
        try {
            String base64Image = imageService.getImageAsBase64(fileId);
            
            if (base64Image == null) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("imageData", base64Image);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Map<String, Object>> deleteImage(@PathVariable String fileId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            imageService.deleteImage(fileId);
            
            response.put("success", true);
            response.put("message", "Image deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to delete image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private String getContentType(String filename) {
        String lowerFilename = filename.toLowerCase();
        if (lowerFilename.endsWith(".png")) return "image/png";
        if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) return "image/jpeg";
        if (lowerFilename.endsWith(".gif")) return "image/gif";
        if (lowerFilename.endsWith(".bmp")) return "image/bmp";
        if (lowerFilename.endsWith(".webp")) return "image/webp";
        return "image/png"; // Default
    }
}
