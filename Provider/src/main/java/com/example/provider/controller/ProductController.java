package com.example.provider.controller;

import com.example.provider.entity.Product;
import com.example.provider.service.IProductService;
import com.example.provider.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("products")
public class ProductController {
    @Autowired
    private IProductService service;

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return service.addProduct(product);
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Integer id) {
        return service.getProductById(id);
    }

    @GetMapping()
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    @PutMapping
    public Product update(@RequestBody Product product) {
        return service.updateProduct(product);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.deleteProduct(id);
        return "Deleted Successfully";
    }
}
