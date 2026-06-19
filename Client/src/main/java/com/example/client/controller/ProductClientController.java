package com.example.client.controller;

import com.example.client.dto.Product;
import com.example.client.service.IProductClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/consumer")
public class ProductClientController {
    @Autowired
    private IProductClientService service;

    @GetMapping
    public ResponseEntity<List<Product>> getProduct() {
        return ResponseEntity.ok(service.getAllProducts());
    }
}
