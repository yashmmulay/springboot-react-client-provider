package com.example.client.controller;

import com.example.client.dto.Product;
import com.example.client.service.IProductClientService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<Product> getProduct() {
        return service.getAllProducts();
    }
}
