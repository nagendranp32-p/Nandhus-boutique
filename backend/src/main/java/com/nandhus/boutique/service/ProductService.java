package com.nandhus.boutique.service;

import com.nandhus.boutique.model.Product;
import com.nandhus.boutique.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final Path rootLocation = Paths.get("uploads");

    @Value("${app.base.url:http://localhost:8080}")
    private String baseUrl;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload folder", e);
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    public Product saveProductWithImage(
            String name,
            String category,
            Double price,
            String sizes,
            String description,
            MultipartFile file) throws IOException {

        String originalFilename = file.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String uniqueFilename = UUID.randomUUID() + extension;

        Files.copy(file.getInputStream(), this.rootLocation.resolve(uniqueFilename), StandardCopyOption.REPLACE_EXISTING);

        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setPrice(price);
        product.setSizes(sizes);
        product.setDescription(description);
        product.setImageUrl(baseUrl + "/uploads/" + uniqueFilename);

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.findById(id).ifPresent(product -> {
            try {
                String url = product.getImageUrl();
                if (url != null && url.contains("/uploads/")) {
                    String filename = url.substring(url.lastIndexOf("/uploads/") + 9);
                    Files.deleteIfExists(rootLocation.resolve(filename));
                }
            } catch (IOException ignored) {}
            productRepository.deleteById(id);
        });
    }
}