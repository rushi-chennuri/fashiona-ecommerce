package com.fashion.controller;

import com.fashion.model.Product;
import com.fashion.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Fashion product catalog endpoints")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products (paginated, sortable, filterable)")
    public ResponseEntity<Page<Product>> getProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "averageRating") String sortBy,
        @RequestParam(defaultValue = "desc") String direction,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        @RequestParam(required = false) String badge
    ) {
        if (search != null || category != null || minPrice != null || maxPrice != null || badge != null) {
            return ResponseEntity.ok(productService.searchProducts(search, category, minPrice, maxPrice, badge, page, size, sortBy));
        }
        return ResponseEntity.ok(productService.getProducts(page, size, sortBy, direction));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<Product> getById(@PathVariable String id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get product by URL slug")
    public ResponseEntity<Product> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getBySlug(slug));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured products")
    public ResponseEntity<List<Product>> getFeatured(@RequestParam(defaultValue = "12") int limit) {
        return ResponseEntity.ok(productService.getFeaturedProducts(limit));
    }

    @GetMapping("/best-sellers")
    @Operation(summary = "Get best-selling products")
    public ResponseEntity<List<Product>> getBestSellers(@RequestParam(defaultValue = "12") int limit) {
        return ResponseEntity.ok(productService.getBestSellers(limit));
    }

    @GetMapping("/new-arrivals")
    @Operation(summary = "Get new arrivals")
    public ResponseEntity<List<Product>> getNewArrivals(@RequestParam(defaultValue = "12") int limit) {
        return ResponseEntity.ok(productService.getNewArrivals(limit));
    }

    @GetMapping("/{id}/related")
    @Operation(summary = "Get products related to the given product")
    public ResponseEntity<List<Product>> getRelated(@PathVariable String id,
                                                     @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(productService.getRelatedProducts(id, limit));
    }

    @GetMapping("/categories")
    @Operation(summary = "List all available product categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new product (Admin only)")
    public ResponseEntity<Product> create(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a product (Admin only)")
    public ResponseEntity<Product> update(@PathVariable String id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Soft-delete a product (Admin only)")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }
}
