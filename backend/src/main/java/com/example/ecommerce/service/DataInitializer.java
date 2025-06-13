package com.example.ecommerce.service;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if database is empty
        if (productRepository.count() == 0) {
            initializeProducts();
        }
    }

    private void initializeProducts() {
        // Electronics
        productRepository.save(new Product(
            "iPhone 15 Pro Max",
            1599.99,
            25,
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop",
            4.8,
            "electronics"
        ));

        productRepository.save(new Product(
            "Samsung Galaxy S24 Ultra",
            1299.99,
            30,
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop",
            4.7,
            "electronics"
        ));

        productRepository.save(new Product(
            "MacBook Pro M3",
            2299.99,
            15,
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
            4.9,
            "electronics"
        ));

        // Fashion
        productRepository.save(new Product(
            "Nike Air Max 270",
            179.99,
            50,
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
            4.5,
            "fashion"
        ));

        productRepository.save(new Product(
            "Adidas Ultra Boost 22",
            199.99,
            35,
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop",
            4.6,
            "fashion"
        ));

        productRepository.save(new Product(
            "Levi's 501 Original Jeans",
            89.99,
            75,
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
            4.4,
            "fashion"
        ));

        // Home & Kitchen
        productRepository.save(new Product(
            "KitchenAid Stand Mixer",
            449.99,
            20,
            "https://images.unsplash.com/photo-1586132727780-e22865e69fd5?w=300&h=300&fit=crop",
            4.8,
            "home"
        ));

        productRepository.save(new Product(
            "Dyson V15 Detect Vacuum",
            749.99,
            18,
            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
            4.7,
            "home"
        ));

        productRepository.save(new Product(
            "Instant Pot Duo 7-in-1",
            129.99,
            40,
            "https://images.unsplash.com/photo-1585515656618-3d5b9c51dd12?w=300&h=300&fit=crop",
            4.6,
            "home"
        ));

        // Books
        productRepository.save(new Product(
            "The Psychology of Programming",
            39.99,
            100,
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
            4.5,
            "books"
        ));

        productRepository.save(new Product(
            "Clean Code: A Handbook",
            49.99,
            85,
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=300&fit=crop",
            4.8,
            "books"
        ));

        productRepository.save(new Product(
            "System Design Interview",
            44.99,
            60,
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
            4.7,
            "books"
        ));

        System.out.println("Sample products initialized successfully!");
    }
}
