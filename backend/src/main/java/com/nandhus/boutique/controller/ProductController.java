package com.nandhus.boutique.controller;

import com.nandhus.boutique.model.Product;
import com.nandhus.boutique.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCatalog(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") Double price,
            @RequestParam(value = "sizes", required = false, defaultValue = "Free Size") String sizes,
            @RequestParam(value = "description", required = false, defaultValue = "") String description,
            @RequestParam("image") MultipartFile image) {
        try {
            Product saved = productService.saveProductWithImage(name, category, price, sizes, description, image);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Image upload failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCatalog(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}