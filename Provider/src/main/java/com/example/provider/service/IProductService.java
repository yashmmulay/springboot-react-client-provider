package com.example.provider.service;

import com.example.provider.entity.Product;

import java.util.List;

public interface IProductService {
    Product addProduct(Product product);
    List<Product> getAllProducts();
    Product getProductById(Integer id);
    Product updateProduct(Product product);
    void deleteProduct(Integer id);
}
