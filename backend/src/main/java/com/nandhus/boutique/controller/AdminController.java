package com.nandhus.boutique.controller;

import com.nandhus.boutique.model.Sale;
import com.nandhus.boutique.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Value("${app.admin.pin}")
    private String adminPin;

    private final SaleRepository saleRepository;

    public AdminController(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String enteredPin = payload.get("pin");
        if (adminPin.equals(enteredPin)) {
            return ResponseEntity.ok(Map.of("authenticated", true, "message", "Welcome to Nandhu's Admin"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("authenticated", false, "message", "Invalid Admin PIN"));
    }

    @GetMapping("/sales")
    public List<Sale> getAllSales() {
        return saleRepository.findAllByOrderBySaleDateDesc();
    }

    @PostMapping("/sales")
    public Sale addSale(@RequestBody Sale sale) {
        return saleRepository.save(sale);
    }

    @DeleteMapping("/sales/{id}")
    public ResponseEntity<?> deleteSale(@PathVariable Long id) {
        saleRepository.deleteById(id);
        return ResponseEntity.ok("Sale record deleted");
    }
}