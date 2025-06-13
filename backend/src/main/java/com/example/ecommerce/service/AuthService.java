package com.example.ecommerce.service;

import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Simple in-memory token store (in production, use Redis or JWT)
    private final Map<String, String> tokenStore = new HashMap<>();

    public Map<String, Object> register(String username, String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        // Check if user already exists
        if (userRepository.existsByUsername(username)) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return response;
        }
        
        if (userRepository.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return response;
        }
        
        // Create new user
        User user = new User(username, email, password);
        User savedUser = userRepository.save(user);
        
        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("user", createUserResponse(savedUser));
        
        return response;
    }

    public Map<String, Object> login(String username, String password) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return response;
        }
        
        User user = userOpt.get();
        
        // In production, use proper password hashing (BCrypt)
        if (!user.getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return response;
        }
        
        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate token
        String token = generateToken(user.getId());
        
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("user", createUserResponse(user));
        
        return response;
    }

    public boolean validateToken(String token) {
        return tokenStore.containsKey(token);
    }

    public String getUserIdFromToken(String token) {
        return tokenStore.get(token);
    }

    public void logout(String token) {
        tokenStore.remove(token);
    }

    private String generateToken(String userId) {
        String token = UUID.randomUUID().toString();
        tokenStore.put(token, userId);
        return token;
    }

    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("username", user.getUsername());
        userResponse.put("email", user.getEmail());
        userResponse.put("firstName", user.getFirstName());
        userResponse.put("lastName", user.getLastName());
        userResponse.put("role", user.getRole());
        return userResponse;
    }

    public Optional<User> findUserById(String userId) {
        return userRepository.findById(userId);
    }
}
