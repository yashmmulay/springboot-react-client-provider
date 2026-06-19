package com.example.provider.service;

import com.example.provider.entity.Product;
import com.example.provider.exception.ProductNotFoundException;
import com.example.provider.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService implements IProductService{

    @Autowired
    ProductRepo repo;

    @Override
    public Product addProduct(Product product) {
        return repo.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    @Override
    public Product getProductById(Integer id) {
        return repo.findById(id).orElseThrow(() -> new ProductNotFoundException("Product with ID " + id + " Not Found"));
    }

    @Override
    public Product updateProduct(Product product) {
        return repo.save(product);
    }

    @Override
    public void deleteProduct(Integer id) {
        Product product = repo.findById(id).orElseThrow(() -> new ProductNotFoundException("Product with ID " + id + " Not Found"));
        repo.deleteById(id);
    }
}
