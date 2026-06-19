package com.example.client.service;

import com.example.client.dto.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class ProductClientService implements  IProductClientService{
    @Autowired
    WebClient webClient;

    @Override
    public List<Product> getAllProducts() {
        return webClient.get().uri("/products").retrieve().bodyToFlux(Product.class).collectList().block();
    }
}
